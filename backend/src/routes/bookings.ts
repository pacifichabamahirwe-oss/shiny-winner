import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking';
import Activity from '../models/Activity';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Create booking
router.post('/', authenticateToken, [
  body('activityId').isMongoId().withMessage('Valid activity ID required'),
  body('activityDate').isISO8601().withMessage('Valid activity date required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required (HH:MM)'),
  body('participants').isInt({ min: 1 }).withMessage('At least 1 participant required'),
  body('paymentMethod').isIn(['mtn_momo', 'airtel_money', 'card', 'cash']),
  body('contactInfo.phone').isMobilePhone('rw-RW'),
  body('contactInfo.email').isEmail()
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
      activityId,
      activityDate,
      startTime,
      endTime,
      participants,
      paymentMethod,
      contactInfo,
      specialRequests,
      dietaryRestrictions,
      accessibilityNeeds
    } = req.body;

    // Check if activity exists and is active
    const activity = await Activity.findOne({
      _id: activityId,
      isActive: true
    }).populate('hostId');

    if (!activity) {
      throw createError('Activity not found or not available', 404);
    }

    // Check if host is verified
    const host = activity.hostId as any;
    if (host.verificationStatus !== 'verified') {
      throw createError('Host is not verified', 400);
    }

    // Check if user is trying to book their own activity
    if (host._id.toString() === req.userId) {
      throw createError('You cannot book your own activity', 400);
    }

    // Validate participants count
    if (participants > activity.maxParticipants) {
      throw createError(`Maximum ${activity.maxParticipants} participants allowed`, 400);
    }

    // Check for date conflicts
    const bookingDateTime = new Date(`${activityDate}T${startTime}:00`);
    const existingBooking = await Booking.findOne({
      activityId,
      activityDate: new Date(activityDate),
      startTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      throw createError('This time slot is already booked', 409);
    }

    // Calculate total amount
    const totalAmount = activity.price.priceType === 'per_person' 
      ? activity.price.amount * participants 
      : activity.price.amount;

    // Create booking
    const booking = new Booking({
      activityId,
      touristId: req.userId,
      hostId: host._id,
      activityDate: new Date(activityDate),
      startTime,
      endTime,
      participants,
      totalAmount,
      currency: activity.price.currency,
      paymentMethod,
      contactInfo,
      specialRequests,
      dietaryRestrictions,
      accessibilityNeeds
    });

    await booking.save();

    // Populate booking data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('activityId', 'title images location duration')
      .populate('touristId', 'firstName lastName profileImage phone email')
      .populate('hostId', 'firstName lastName profileImage phone email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: populatedBooking }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { status, type = 'tourist', page = 1, limit = 20 } = req.query;

    const filter: any = {};
    
    if (type === 'tourist') {
      filter.touristId = req.userId;
    } else if (type === 'host') {
      filter.hostId = req.userId;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const bookings = await Booking.find(filter)
      .populate('activityId', 'title images location duration price')
      .populate('touristId', 'firstName lastName profileImage phone')
      .populate('hostId', 'firstName lastName profileImage phone')
      .sort({ activityDate: -1 })
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

// Get booking by ID
router.get('/:bookingId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      $or: [{ touristId: req.userId }, { hostId: req.userId }]
    })
    .populate('activityId', 'title images location duration price includes requirements')
    .populate('touristId', 'firstName lastName profileImage phone email')
    .populate('hostId', 'firstName lastName profileImage phone email');

    if (!booking) {
      throw createError('Booking not found or unauthorized', 404);
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
});

// Update booking status (host can confirm/cancel, tourist can cancel)
router.put('/:bookingId/status', authenticateToken, [
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'no_show']),
  body('cancellationReason').optional().isLength({ max: 500 })
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

    const { bookingId } = req.params;
    const { status, cancellationReason } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      $or: [{ touristId: req.userId }, { hostId: req.userId }]
    });

    if (!booking) {
      throw createError('Booking not found or unauthorized', 404);
    }

    // Check if user has permission for this status change
    const isHost = booking.hostId.toString() === req.userId;
    const isTourist = booking.touristId.toString() === req.userId;

    if (status === 'confirmed' && !isHost) {
      throw createError('Only host can confirm bookings', 403);
    }

    if (status === 'completed' && !isHost) {
      throw createError('Only host can mark bookings as completed', 403);
    }

    if (status === 'no_show' && !isHost) {
      throw createError('Only host can mark bookings as no-show', 403);
    }

    // Update booking
    const updateData: any = { status };
    
    if (status === 'cancelled') {
      updateData.cancellationReason = cancellationReason;
      updateData.cancelledBy = isHost ? 'host' : 'tourist';
      updateData.cancellationDate = new Date();
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    )
    .populate('activityId', 'title images location')
    .populate('touristId', 'firstName lastName profileImage')
    .populate('hostId', 'firstName lastName profileImage');

    // Update activity booking count if completed
    if (status === 'completed') {
      await Activity.findByIdAndUpdate(booking.activityId, {
        $inc: { totalBookings: 1 }
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking: updatedBooking }
    });
  } catch (error) {
    next(error);
  }
});

// Update payment status
router.put('/:bookingId/payment', authenticateToken, [
  body('paymentStatus').isIn(['paid', 'partially_paid', 'refunded', 'failed']),
  body('transactionId').optional().notEmpty(),
  body('depositAmount').optional().isFloat({ min: 0 }),
  body('remainingAmount').optional().isFloat({ min: 0 })
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

    const { bookingId } = req.params;
    const { paymentStatus, transactionId, depositAmount, remainingAmount } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      touristId: req.userId
    });

    if (!booking) {
      throw createError('Booking not found or unauthorized', 404);
    }

    const paymentDetails: any = {
      ...booking.paymentDetails,
      paymentDate: new Date()
    };

    if (transactionId) paymentDetails.transactionId = transactionId;
    if (depositAmount !== undefined) paymentDetails.depositAmount = depositAmount;
    if (remainingAmount !== undefined) paymentDetails.remainingAmount = remainingAmount;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus,
        paymentDetails
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: { booking: updatedBooking }
    });
  } catch (error) {
    next(error);
  }
});

// Get booking statistics
router.get('/stats/summary', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userType } = req.query;
    
    const matchField = userType === 'host' ? 'hostId' : 'touristId';
    
    const stats = await Booking.aggregate([
      { $match: { [matchField]: req.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const summary = {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0
    };

    stats.forEach(stat => {
      summary.total += stat.count;
      summary[stat._id as keyof typeof summary] = stat.count;
      if (stat._id === 'completed') {
        summary.totalRevenue = stat.totalAmount;
      }
    });

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    next(error);
  }
});

export default router;