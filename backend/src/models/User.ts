import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'tourist' | 'local' | 'admin';
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  language: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    city: string;
    province: string;
  };
  
  // Tourist-specific fields
  interests?: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  travelStyle?: string;
  groupSize?: number;
  
  // Local host-specific fields
  bio?: string;
  skills?: string[];
  languages?: string[];
  experienceYears?: number;
  hostingCapacity?: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: {
    idCard?: string;
    businessLicense?: string;
  };
  
  // Ratings and reviews
  averageRating?: number;
  totalReviews?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  userType: {
    type: String,
    enum: ['tourist', 'local', 'admin'],
    required: true
  },
  profileImage: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'rw', 'fr', 'sw']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: String,
    city: String,
    province: {
      type: String,
      enum: ['Kigali', 'Eastern', 'Northern', 'Southern', 'Western']
    }
  },
  
  // Tourist fields
  interests: [{
    type: String,
    enum: ['cooking', 'crafts', 'village_tours', 'storytelling', 'traditional_dance', 'music', 'agriculture', 'history', 'nature']
  }],
  budget: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'RWF'
    }
  },
  travelStyle: {
    type: String,
    enum: ['solo', 'couple', 'family', 'group', 'business']
  },
  groupSize: {
    type: Number,
    min: 1,
    max: 20
  },
  
  // Local host fields
  bio: {
    type: String,
    maxlength: 500
  },
  skills: [{
    type: String
  }],
  languages: [{
    type: String,
    enum: ['en', 'rw', 'fr', 'sw']
  }],
  experienceYears: {
    type: Number,
    min: 0
  },
  hostingCapacity: {
    type: Number,
    min: 1,
    max: 50
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: {
    idCard: String,
    businessLicense: String
  },
  
  // Ratings
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for geospatial queries
UserSchema.index({ location: '2dsphere' });

// Index for search optimization
UserSchema.index({ userType: 1, isActive: 1, verificationStatus: 1 });
UserSchema.index({ 'location.province': 1, userType: 1 });

export default mongoose.model<IUser>('User', UserSchema);