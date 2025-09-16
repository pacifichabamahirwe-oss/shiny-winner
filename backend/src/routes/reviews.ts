import express from 'express';
import { body, validationResult } from 'express-validator';
import Review from '../models/Review';
import Booking from '../models/Booking';
import Activity from '../models/Activity';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Create review
router.post('/', authenticateToken, [
  body('bookingId').isMongoId().withMessage('Valid booking ID required'),
  body('overallRating').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be 1-5'),
  body('ratings.communication').isInt({ min: 1, max: 5 }),
  body('ratings.accuracy').isInt({ min: 1, max: 5 }),
  body('ratings.value').isInt({ min: 1, max: 5 }),
  body('ratings.experience').isInt({ min: 1, max: 5 }),
  body('ratings.safety').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters'),
  body('title').optional().trim().isLength({ max: 100 })
], async (req: AuthRequest, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      bookingId,
      overallRating,
      ratings,
      title,
      comment,
      images
    } = req.body;

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      touristId: req.userId,
      status: 'completed'
    });

    if (!booking) {
      throw createError('Booking not found, not completed, or unauthorized', 404);
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      throw createError('Review already exists for this booking', 409);
    }

    // Create review
    const review = new Review({
      bookingId,
      activityId: booking.activityId,
      touristId: req.userId,
      hostId: booking.hostId,
      overallRating,
      ratings,
      title,
      comment,
      images: images || []
    });

    await review.save();

    // Update booking to mark as reviewed
    await Booking.findByIdAndUpdate(bookingId, { hasReviewed: true });

    // Update activity and host ratings
    await updateRatings(booking.activityId.toString(), booking.hostId.toString());

    const populatedReview = await Review.findById(review._id)
      .populate('touristId', 'firstName lastName profileImage')
      .populate('activityId', 'title');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    next(error);
  }
});

// Get reviews for an activity
router.get('/activity/:activityId', async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { page = 1, limit = 20, sortBy = 'newest' } = req.query;

    let sort: any = { createdAt: -1 };
    if (sortBy === 'rating') {
      sort = { overallRating: -1, createdAt: -1 };
    } else if (sortBy === 'helpful') {
      sort = { helpfulVotes: -1, createdAt: -1 };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await Review.find({
      activityId,
      isApproved: true
    })
    .populate('touristId', 'firstName lastName profileImage')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit as string));

    const total = await Review.countDocuments({
      activityId,
      isApproved: true
    });

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { activityId: activityId, isApproved: true } },
      {
        $group: {
          _id: '$overallRating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    ratingStats.forEach(stat => {
      ratingDistribution[stat._id as keyof typeof ratingDistribution] = stat.count;
    });

    res.json({
      success: true,
      data: {
        reviews,
        ratingDistribution,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get reviews by host
router.get('/host/:hostId', async (req, res, next) => {
  try {
    const { hostId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await Review.find({
      hostId,
      isApproved: true
    })
    .populate('touristId', 'firstName lastName profileImage')
    .populate('activityId', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit as string));

    const total = await Review.countDocuments({
      hostId,
      isApproved: true
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Host response to review
router.post('/:reviewId/response', authenticateToken, [
  body('comment').trim().isLength({ min: 1, max: 500 }).withMessage('Response must be 1-500 characters')
], async (req: AuthRequest, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reviewId } = req.params;
    const { comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      hostId: req.userId
    });

    if (!review) {
      throw createError('Review not found or unauthorized', 404);
    }

    if (review.hostResponse) {
      throw createError('Response already exists for this review', 409);
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        hostResponse: {
          comment,
          responseDate: new Date()
        }
      },
      { new: true }
    )
    .populate('touristId', 'firstName lastName profileImage')
    .populate('activityId', 'title');

    res.json({
      success: true,
      message: 'Response added successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    next(error);
  }
});

// Vote review as helpful
router.post('/:reviewId/helpful', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );

    if (!review) {
      throw createError('Review not found', 404);
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: { helpfulVotes: review.helpfulVotes }
    });
  } catch (error) {
    next(error);
  }
});

// Update ratings for activity and host
async function updateRatings(activityId: string, hostId: string) {
  try {
    // Update activity ratings
    const activityStats = await Review.aggregate([
      { $match: { activityId: activityId, isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$overallRating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (activityStats.length > 0) {
      await Activity.findByIdAndUpdate(activityId, {
        averageRating: Math.round(activityStats[0].averageRating * 10) / 10,
        totalReviews: activityStats[0].totalReviews
      });
    }

    // Update host ratings
    const hostStats = await Review.aggregate([
      { $match: { hostId: hostId, isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$overallRating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (hostStats.length > 0) {
      await User.findByIdAndUpdate(hostId, {
        averageRating: Math.round(hostStats[0].averageRating * 10) / 10,
        totalReviews: hostStats[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
}

export default router;