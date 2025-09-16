import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthenticatedSocket {
  userId?: string;
  user?: any;
}

export const setupSocket = (io: Server) => {
  // Authentication middleware for socket connections
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      const user = await User.findById(decoded.userId).select('-password');
      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: any) => {
    console.log(`User connected: ${socket.user.firstName} (${socket.userId})`);

    // Join user to their own room for private messages
    socket.join(socket.userId);

    // Join conversation rooms
    socket.on('join_conversation', (conversationId: string) => {
      // Verify user is part of this conversation
      const userIds = conversationId.split('-');
      if (userIds.includes(socket.userId)) {
        socket.join(conversationId);
        console.log(`User ${socket.userId} joined conversation ${conversationId}`);
      }
    });

    // Leave conversation rooms
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Handle typing indicators
    socket.on('typing_start', (data: { conversationId: string, receiverId: string }) => {
      socket.to(data.receiverId).emit('user_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data: { conversationId: string, receiverId: string }) => {
      socket.to(data.receiverId).emit('user_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
        isTyping: false
      });
    });

    // Handle booking notifications
    socket.on('booking_notification', (data: { receiverId: string, bookingData: any }) => {
      socket.to(data.receiverId).emit('booking_update', data.bookingData);
    });

    // Handle message read receipts
    socket.on('message_read', (data: { conversationId: string, messageId: string, senderId: string }) => {
      socket.to(data.senderId).emit('message_read_receipt', {
        conversationId: data.conversationId,
        messageId: data.messageId,
        readBy: socket.userId
      });
    });

    // Handle user presence
    socket.on('user_online', () => {
      socket.broadcast.emit('user_status', {
        userId: socket.userId,
        status: 'online'
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.firstName} (${socket.userId})`);
      
      // Broadcast user offline status
      socket.broadcast.emit('user_status', {
        userId: socket.userId,
        status: 'offline'
      });
    });

    // Handle errors
    socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  });

  // Handle connection errors
  io.engine.on('connection_error', (err: any) => {
    console.error('Socket connection error:', err);
  });
};

// Helper function to emit to specific user
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(userId).emit(event, data);
};

// Helper function to emit to conversation
export const emitToConversation = (io: Server, conversationId: string, event: string, data: any) => {
  io.to(conversationId).emit(event, data);
};