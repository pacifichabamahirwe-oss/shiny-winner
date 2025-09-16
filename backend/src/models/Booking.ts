import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  activityId: string;
  touristId: string;
  hostId: string;
  bookingDate: Date;
  activityDate: Date;
  startTime: string;
  endTime: string;
  participants: number;
  totalAmount: number;
  currency: string;
  
  // Payment information
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  paymentMethod: 'mtn_momo' | 'airtel_money' | 'card' | 'cash';
  paymentDetails: {
    transactionId?: string;
    depositAmount?: number;
    remainingAmount?: number;
    paymentDate?: Date;
  };
  
  // Booking status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  cancellationReason?: string;
  cancelledBy?: 'tourist' | 'host' | 'admin';
  cancellationDate?: Date;
  
  // Special requests
  specialRequests?: string;
  dietaryRestrictions?: string[];
  accessibilityNeeds?: string;
  
  // Contact information
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  
  // Review and rating (filled after completion)
  hasReviewed: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  activityId: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  touristId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  activityDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'RWF'
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mtn_momo', 'airtel_money', 'card', 'cash'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    depositAmount: Number,
    remainingAmount: Number,
    paymentDate: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['tourist', 'host', 'admin']
  },
  cancellationDate: Date,
  
  // Special requirements
  specialRequests: {
    type: String,
    maxlength: 500
  },
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free', 'dairy_free', 'nut_allergy', 'other']
  }],
  accessibilityNeeds: {
    type: String,
    maxlength: 200
  },
  
  // Contact
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  
  hasReviewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
BookingSchema.index({ touristId: 1, activityDate: -1 });
BookingSchema.index({ hostId: 1, activityDate: -1 });
BookingSchema.index({ activityId: 1, activityDate: 1 });
BookingSchema.index({ status: 1, activityDate: 1 });
BookingSchema.index({ paymentStatus: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);