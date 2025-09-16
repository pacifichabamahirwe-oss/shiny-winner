import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  messageType: 'text' | 'image' | 'booking_request' | 'booking_update' | 'system';
  content: string;
  metadata?: {
    bookingId?: string;
    imageUrl?: string;
    systemType?: 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'reminder';
  };
  isRead: boolean;
  readAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'booking_request', 'booking_update', 'system'],
    default: 'text'
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  metadata: {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking'
    },
    imageUrl: String,
    systemType: {
      type: String,
      enum: ['booking_confirmed', 'booking_cancelled', 'payment_received', 'reminder']
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date
}, {
  timestamps: true
});

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);