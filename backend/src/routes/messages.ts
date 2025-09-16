import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { io } from '../index';

const router = express.Router();

// Send message
router.post('/', authenticateToken, [
  body('receiverId').isMongoId().withMessage('Valid receiver ID required'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message content must be 1-1000 characters'),
  body('messageType').optional().isIn(['text', 'image', 'booking_request', 'booking_update'])
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
      receiverId,
      content,
      messageType = 'text',
      metadata
    } = req.body;

    // Create conversation ID (consistent ordering)
    const conversationId = [req.userId, receiverId].sort().join('-');

    const message = new Message({
      conversationId,
      senderId: req.userId,
      receiverId,
      messageType,
      content,
      metadata,
      isDelivered: true,
      deliveredAt: new Date()
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName profileImage')
      .populate('receiverId', 'firstName lastName profileImage');

    // Emit real-time message
    io.to(receiverId).emit('new_message', populatedMessage);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: populatedMessage }
    });
  } catch (error) {
    next(error);
  }
});

// Get conversations
router.get('/conversations', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get latest message from each conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.userId },
            { receiverId: req.userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', req.userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      {
        $skip: (parseInt(page as string) - 1) * parseInt(limit as string)
      },
      {
        $limit: parseInt(limit as string)
      }
    ]);

    // Populate user details
    await Message.populate(conversations, [
      {
        path: 'lastMessage.senderId',
        select: 'firstName lastName profileImage'
      },
      {
        path: 'lastMessage.receiverId',
        select: 'firstName lastName profileImage'
      }
    ]);

    res.json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
});

// Get messages in a conversation
router.get('/conversation/:conversationId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of this conversation
    const userIds = conversationId.split('-');
    if (!userIds.includes(req.userId)) {
      throw createError('Unauthorized access to conversation', 403);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'firstName lastName profileImage')
      .populate('receiverId', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: req.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    const total = await Message.countDocuments({ conversationId });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
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

// Mark messages as read
router.put('/conversation/:conversationId/read', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { conversationId } = req.params;

    // Verify user is part of this conversation
    const userIds = conversationId.split('-');
    if (!userIds.includes(req.userId)) {
      throw createError('Unauthorized access to conversation', 403);
    }

    await Message.updateMany(
      {
        conversationId,
        receiverId: req.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiverId: req.userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    next(error);
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      senderId: req.userId
    });

    if (!message) {
      throw createError('Message not found or unauthorized', 404);
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;