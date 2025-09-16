// User Types
export interface User {
  _id: string;
  email: string;
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
    coordinates: [number, number];
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
  
  // Ratings
  averageRating?: number;
  totalReviews?: number;
  
  createdAt: string;
  updatedAt: string;
}

// Activity Types
export interface Activity {
  _id: string;
  hostId: string | User;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  images: string[];
  duration: number;
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
  includes: string[];
  requirements?: string[];
  cancellationPolicy: string;
  isActive: boolean;
  featured: boolean;
  
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  blackoutDates: string[];
  
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  _id: string;
  activityId: string | Activity;
  touristId: string | User;
  hostId: string | User;
  bookingDate: string;
  activityDate: string;
  startTime: string;
  endTime: string;
  participants: number;
  totalAmount: number;
  currency: string;
  
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  paymentMethod: 'mtn_momo' | 'airtel_money' | 'card' | 'cash';
  paymentDetails: {
    transactionId?: string;
    depositAmount?: number;
    remainingAmount?: number;
    paymentDate?: string;
  };
  
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  cancellationReason?: string;
  cancelledBy?: 'tourist' | 'host' | 'admin';
  cancellationDate?: string;
  
  specialRequests?: string;
  dietaryRestrictions?: string[];
  accessibilityNeeds?: string;
  
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  
  hasReviewed: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  bookingId: string;
  activityId: string | Activity;
  touristId: string | User;
  hostId: string | User;
  
  overallRating: number;
  ratings: {
    communication: number;
    accuracy: number;
    value: number;
    experience: number;
    safety: number;
  };
  
  title?: string;
  comment: string;
  images?: string[];
  
  hostResponse?: {
    comment: string;
    responseDate: string;
  };
  
  isApproved: boolean;
  moderationNotes?: string;
  helpfulVotes: number;
  
  createdAt: string;
  updatedAt: string;
}

// Message Types
export interface Message {
  _id: string;
  conversationId: string;
  senderId: string | User;
  receiverId: string | User;
  messageType: 'text' | 'image' | 'booking_request' | 'booking_update' | 'system';
  content: string;
  metadata?: {
    bookingId?: string;
    imageUrl?: string;
    systemType?: 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'reminder';
  };
  isRead: boolean;
  readAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginationResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ActivityDetail: { activityId: string };
  HostProfile: { hostId: string };
  BookingDetail: { bookingId: string };
  CreateBooking: { activityId: string };
  Chat: { conversationId: string; receiverId: string; receiverName: string };
  Profile: undefined;
  EditProfile: undefined;
  CreateActivity: undefined;
  EditActivity: { activityId: string };
  ReviewsScreen: { activityId: string };
  WriteReview: { bookingId: string };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  province?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  difficulty?: string;
  rating?: number;
  featured?: boolean;
  search?: string;
  sortBy?: 'featured' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popular';
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'tourist' | 'local';
  language: string;
  interests?: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  bio?: string;
  skills?: string[];
  languages?: string[];
}

export interface CreateActivityForm {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  images: string[];
  duration: number;
  price: {
    amount: number;
    currency: string;
    priceType: 'per_person' | 'per_group';
  };
  location: {
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
  includes: string[];
  requirements?: string[];
  cancellationPolicy: string;
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

export interface CreateBookingForm {
  activityDate: string;
  startTime: string;
  endTime: string;
  participants: number;
  paymentMethod: 'mtn_momo' | 'airtel_money' | 'card' | 'cash';
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  specialRequests?: string;
  dietaryRestrictions?: string[];
  accessibilityNeeds?: string;
}