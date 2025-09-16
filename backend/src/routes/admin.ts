import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Activity from '../models/Activity';
import Booking from '../models/Booking';
import Review from '../models/Review';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken, requireRole(['admin']));

// Dashboard statistics
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalHosts,
      totalTourists,
      totalActivities,
      totalBookings,
      totalRevenue,
      pendingVerifications,
      activeBookings
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ userType: 'local', isActive: true }),
      User.countDocuments({ userType: 'tourist', isActive: true }),
      Activity.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      User.countDocuments({ verificationStatus: 'pending' }),
      Booking.countDocuments({ status: { $in: ['pending', 'confirmed'] } })
    ]);

    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalHosts,
          totalTourists,
          totalActivities,
          totalBookings,
          totalRevenue: totalRevenue[0]?.total || 0,
          pendingVerifications,
          activeBookings
        },
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
});

// User management
router.get('/users', async (req, res, next) => {
  try {
    const {
      userType,
      verificationStatus,
      isActive,
      search,
      page = 1,
      limit = 50
    } = req.query;

    const filter: any = {};
    
    if (userType) filter.userType = userType;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search as string, 'i') },
        { lastName: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') }
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
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

// Update user verification status
router.put('/users/:userId/verification', [
  body('verificationStatus').isIn(['pending', 'verified', 'rejected']),
  body('notes').optional().isLength({ max: 500 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { verificationStatus, notes } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        verificationStatus,
        ...(notes && { verificationNotes: notes })
      },
      { new: true }
    ).select('-password');

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Verification status updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Deactivate/activate user
router.put('/users/:userId/status', [
  body('isActive').isBoolean()
], async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Activity management
router.get('/activities', async (req, res, next) => {
  try {
    const {
      category,
      province,
      isActive,
      featured,
      search,
      page = 1,
      limit = 50
    } = req.query;

    const filter: any = {};
    
    if (category) filter.category = category;
    if (province) filter['location.province'] = province;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    
    if (search) {
      filter.$or = [
        { title: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') }
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const activities = await Activity.find(filter)
      .populate('hostId', 'firstName lastName email verificationStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Activity.countDocuments(filter);

    res.json({
      success: true,
      data: {
        activities,
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

// Feature/unfeature activity
router.put('/activities/:activityId/featured', [
  body('featured').isBoolean()
], async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { featured } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { featured },
      { new: true }
    ).populate('hostId', 'firstName lastName');

    if (!activity) {
      throw createError('Activity not found', 404);
    }

    res.json({
      success: true,
      message: `Activity ${featured ? 'featured' : 'unfeatured'} successfully`,
      data: { activity }
    });
  } catch (error) {
    next(error);
  }
});

// Booking management
router.get('/bookings', async (req, res, next) => {
  try {
    const {
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = req.query;

    const filter: any = {};
    
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    if (dateFrom || dateTo) {
      filter.activityDate = {};
      if (dateFrom) filter.activityDate.$gte = new Date(dateFrom as string);
      if (dateTo) filter.activityDate.$lte = new Date(dateTo as string);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const bookings = await Booking.find(filter)
      .populate('touristId', 'firstName lastName email')
      .populate('hostId', 'firstName lastName email')
      .populate('activityId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings,
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

// Review moderation
router.get('/reviews', async (req, res, next) => {
  try {
    const {
      isApproved,
      rating,
      page = 1,
      limit = 50
    } = req.query;

    const filter: any = {};
    
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (rating) filter.overallRating = parseInt(rating as string);

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await Review.find(filter)
      .populate('touristId', 'firstName lastName')
      .populate('hostId', 'firstName lastName')
      .populate('activityId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Review.countDocuments(filter);

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

// Approve/reject review
router.put('/reviews/:reviewId/moderation', [
  body('isApproved').isBoolean(),
  body('moderationNotes').optional().isLength({ max: 500 })
], async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { isApproved, moderationNotes } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { 
        isApproved,
        ...(moderationNotes && { moderationNotes })
      },
      { new: true }
    );

    if (!review) {
      throw createError('Review not found', 404);
    }

    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
});

export default router;