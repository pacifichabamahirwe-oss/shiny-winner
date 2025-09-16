import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone('rw-RW'),
  body('bio').optional().isLength({ max: 500 }),
  body('interests').optional().isArray(),
  body('skills').optional().isArray(),
  body('languages').optional().isArray()
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

    const allowedFields = [
      'firstName', 'lastName', 'phone', 'profileImage', 'language',
      'location', 'interests', 'budget', 'travelStyle', 'groupSize',
      'bio', 'skills', 'languages', 'experienceYears', 'hostingCapacity'
    ];

    const updateData: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID (public profile)
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select(
      '-password -verificationDocuments -email -phone'
    );
    
    if (!user) {
      throw createError('User not found', 404);
    }

    if (!user.isActive) {
      throw createError('User profile not available', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Search local hosts
router.get('/hosts/search', async (req, res, next) => {
  try {
    const {
      province,
      skills,
      languages,
      rating,
      page = 1,
      limit = 20
    } = req.query;

    const filter: any = {
      userType: 'local',
      isActive: true,
      verificationStatus: 'verified'
    };

    if (province) {
      filter['location.province'] = province;
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skills = { $in: skillsArray };
    }

    if (languages) {
      const languagesArray = Array.isArray(languages) ? languages : [languages];
      filter.languages = { $in: languagesArray };
    }

    if (rating) {
      filter.averageRating = { $gte: parseFloat(rating as string) };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const hosts = await User.find(filter)
      .select('-password -verificationDocuments -email -phone')
      .sort({ averageRating: -1, totalReviews: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        hosts,
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

// Upload profile image
router.post('/upload-image', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    // This would typically use multer middleware for file upload
    // For now, we'll assume the image URL is provided
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw createError('Image URL is required', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Submit verification documents (for local hosts)
router.post('/verification', authenticateToken, requireRole(['local']), [
  body('idCard').notEmpty().withMessage('ID card image is required'),
  body('businessLicense').optional()
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

    const { idCard, businessLicense } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        verificationDocuments: {
          idCard,
          businessLicense
        },
        verificationStatus: 'pending'
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Verification documents submitted successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Deactivate account
router.post('/deactivate', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    await User.findByIdAndUpdate(req.userId, { isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;