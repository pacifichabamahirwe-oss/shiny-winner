import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  _id: string;
  hostId: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  images: string[];
  duration: number; // in hours
  price: {
    amount: number;
    currency: string;
    priceType: 'per_person' | 'per_group';
  };
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    city: string;
    province: string;
  };
  languages: string[];
  maxParticipants: number;
  minAge?: number;
  maxAge?: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  includes: string[]; // What's included in the experience
  requirements?: string[]; // What participants need to bring/know
  cancellationPolicy: string;
  isActive: boolean;
  featured: boolean;
  
  // Availability
  availability: {
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string; // "09:00"
    endTime: string; // "17:00"
  }[];
  blackoutDates: Date[]; // Dates when activity is not available
  
  // Ratings and reviews
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema({
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['cooking', 'crafts', 'village_tours', 'storytelling', 'traditional_dance', 'music', 'agriculture', 'history', 'nature', 'other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number,
    required: true,
    min: 0.5,
    max: 24
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'RWF'
    },
    priceType: {
      type: String,
      enum: ['per_person', 'per_group'],
      default: 'per_person'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true,
      enum: ['Kigali', 'Eastern', 'Northern', 'Southern', 'Western']
    }
  },
  languages: [{
    type: String,
    enum: ['en', 'rw', 'fr', 'sw'],
    required: true
  }],
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  minAge: {
    type: Number,
    min: 0,
    max: 100
  },
  maxAge: {
    type: Number,
    min: 0,
    max: 100
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  includes: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  cancellationPolicy: {
    type: String,
    required: true,
    enum: ['flexible', 'moderate', 'strict']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Availability
  availability: [{
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6
    },
    startTime: String,
    endTime: String
  }],
  blackoutDates: [Date],
  
  // Metrics
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
ActivitySchema.index({ location: '2dsphere' });
ActivitySchema.index({ category: 1, isActive: 1 });
ActivitySchema.index({ 'location.province': 1, category: 1, isActive: 1 });
ActivitySchema.index({ averageRating: -1, totalReviews: -1 });
ActivitySchema.index({ 'price.amount': 1, category: 1 });
ActivitySchema.index({ featured: -1, averageRating: -1 });

export default mongoose.model<IActivity>('Activity', ActivitySchema);