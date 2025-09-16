import express from 'express';
import { body, validationResult } from 'express-validator';
import Activity from '../models/Activity';
import User from '../models/User';
import { authenticateToken, AuthRequest, requireRole, requireVerification } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get all activities with search and filters
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      province,
      city,
      minPrice,
      maxPrice,
      language,
      difficulty,
      rating,
      featured,
      search,
      sortBy = 'featured',
      page = 1,
      limit = 20
    } = req.query;

    const filter: any = { isActive: true };

    // Build filter object
    if (category) filter.category = category;
    if (province) filter['location.province'] = province;
    if (city) filter['location.city'] = new RegExp(city as string, 'i');
    if (language) {
      const languagesArray = Array.isArray(language) ? language : [language];
      filter.languages = { $in: languagesArray };
    }
    if (difficulty) filter.difficulty = difficulty;
    if (featured) filter.featured = featured === 'true';
    if (rating) filter.averageRating = { $gte: parseFloat(rating as string) };

    // Price filter
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice as string);
      if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice as string);
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') }
      ];
    }

    // Sorting
    let sort: any = {};
    switch (sortBy) {
      case 'price_low':
        sort = { 'price.amount': 1 };
        break;
      case 'price_high':
        sort = { 'price.amount': -1 };
        break;
      case 'rating':
        sort = { averageRating: -1, totalReviews: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'popular':
        sort = { totalBookings: -1, averageRating: -1 };
        break;
      default:
        sort = { featured: -1, averageRating: -1 };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const activities = await Activity.find(filter)
      .populate('hostId', 'firstName lastName profileImage averageRating totalReviews verificationStatus')
      .sort(sort)
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

// Get activity by ID
router.get('/:activityId', async (req, res, next) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findOne({
      _id: activityId,
      isActive: true
    }).populate('hostId', 'firstName lastName profileImage averageRating totalReviews verificationStatus bio languages experienceYears');

    if (!activity) {
      throw createError('Activity not found', 404);
    }

    res.json({
      success: true,
      data: { activity }
    });
  } catch (error) {
    next(error);
  }
});

// Create new activity (hosts only)
router.post('/', authenticateToken, requireRole(['local']), requireVerification, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').isIn(['cooking', 'crafts', 'village_tours', 'storytelling', 'traditional_dance', 'music', 'agriculture', 'history', 'nature', 'other']),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('duration').isFloat({ min: 0.5, max: 24 }).withMessage('Duration must be between 0.5 and 24 hours'),
  body('price.amount').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.province').isIn(['Kigali', 'Eastern', 'Northern', 'Southern', 'Western']),
  body('languages').isArray({ min: 1 }).withMessage('At least one language is required'),
  body('maxParticipants').isInt({ min: 1, max: 50 }).withMessage('Max participants must be 1-50'),
  body('cancellationPolicy').isIn(['flexible', 'moderate', 'strict'])
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

    const activityData = {
      ...req.body,
      hostId: req.userId
    };

    const activity = new Activity(activityData);
    await activity.save();

    const populatedActivity = await Activity.findById(activity._id)
      .populate('hostId', 'firstName lastName profileImage');

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: { activity: populatedActivity }
    });
  } catch (error) {
    next(error);
  }
});

// Update activity (host only)
router.put('/:activityId', authenticateToken, requireRole(['local']), async (req: AuthRequest, res, next) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findOne({
      _id: activityId,
      hostId: req.userId
    });

    if (!activity) {
      throw createError('Activity not found or unauthorized', 404);
    }

    const allowedFields = [
      'title', 'description', 'category', 'subcategory', 'images',
      'duration', 'price', 'location', 'languages', 'maxParticipants',
      'minAge', 'maxAge', 'difficulty', 'includes', 'requirements',
      'cancellationPolicy', 'availability', 'blackoutDates'
    ];

    const updateData: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      updateData,
      { new: true, runValidators: true }
    ).populate('hostId', 'firstName lastName profileImage');

    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: { activity: updatedActivity }
    });
  } catch (error) {
    next(error);
  }
});

// Delete/deactivate activity
router.delete('/:activityId', authenticateToken, requireRole(['local']), async (req: AuthRequest, res, next) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findOneAndUpdate(
      { _id: activityId, hostId: req.userId },
      { isActive: false },
      { new: true }
    );

    if (!activity) {
      throw createError('Activity not found or unauthorized', 404);
    }

    res.json({
      success: true,
      message: 'Activity deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get host's activities
router.get('/host/my-activities', authenticateToken, requireRole(['local']), async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;

    const filter: any = { hostId: req.userId };
    
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const activities = await Activity.find(filter)
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

// Get activity categories
router.get('/meta/categories', async (req, res, next) => {
  try {
    const categories = [
      { value: 'cooking', label: 'Cooking & Food', icon: '🍳' },
      { value: 'crafts', label: 'Traditional Crafts', icon: '🎨' },
      { value: 'village_tours', label: 'Village Tours', icon: '🏘️' },
      { value: 'storytelling', label: 'Storytelling', icon: '📚' },
      { value: 'traditional_dance', label: 'Traditional Dance', icon: '💃' },
      { value: 'music', label: 'Music & Instruments', icon: '🎵' },
      { value: 'agriculture', label: 'Agriculture & Farming', icon: '🌾' },
      { value: 'history', label: 'History & Culture', icon: '🏛️' },
      { value: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
      { value: 'other', label: 'Other Experiences', icon: '✨' }
    ];

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
});

export default router;