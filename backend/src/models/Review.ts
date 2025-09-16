import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  bookingId: string;
  activityId: string;
  touristId: string;
  hostId: string;
  
  // Ratings (1-5 stars)
  overallRating: number;
  ratings: {
    communication: number;
    accuracy: number;
    value: number;
    experience: number;
    safety: number;
  };
  
  // Review content
  title?: string;
  comment: string;
  images?: string[];
  
  // Host response
  hostResponse?: {
    comment: string;
    responseDate: Date;
  };
  
  // Moderation
  isApproved: boolean;
  moderationNotes?: string;
  
  // Helpful votes
  helpfulVotes: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
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
  
  // Ratings
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ratings: {
    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    accuracy: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    experience: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    safety: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  
  // Content
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  
  // Host response
  hostResponse: {
    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    responseDate: Date
  },
  
  // Moderation
  isApproved: {
    type: Boolean,
    default: true
  },
  moderationNotes: String,
  
  // Community engagement
  helpfulVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
ReviewSchema.index({ activityId: 1, isApproved: 1, createdAt: -1 });
ReviewSchema.index({ hostId: 1, isApproved: 1, createdAt: -1 });
ReviewSchema.index({ touristId: 1, createdAt: -1 });
ReviewSchema.index({ overallRating: -1, isApproved: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);