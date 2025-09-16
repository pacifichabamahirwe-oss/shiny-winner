// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

export const SOCKET_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://your-production-api.com';

// Rwanda-specific constants
export const RWANDA_PROVINCES = [
  { value: 'Kigali', label: 'Kigali City' },
  { value: 'Eastern', label: 'Eastern Province' },
  { value: 'Northern', label: 'Northern Province' },
  { value: 'Southern', label: 'Southern Province' },
  { value: 'Western', label: 'Western Province' }
];

export const ACTIVITY_CATEGORIES = [
  { value: 'cooking', label: 'Cooking & Food', icon: '🍳', color: '#FF6B6B' },
  { value: 'crafts', label: 'Traditional Crafts', icon: '🎨', color: '#4ECDC4' },
  { value: 'village_tours', label: 'Village Tours', icon: '🏘️', color: '#45B7D1' },
  { value: 'storytelling', label: 'Storytelling', icon: '📚', color: '#96CEB4' },
  { value: 'traditional_dance', label: 'Traditional Dance', icon: '💃', color: '#FECA57' },
  { value: 'music', label: 'Music & Instruments', icon: '🎵', color: '#FF9FF3' },
  { value: 'agriculture', label: 'Agriculture & Farming', icon: '🌾', color: '#54A0FF' },
  { value: 'history', label: 'History & Culture', icon: '🏛️', color: '#5F27CD' },
  { value: 'nature', label: 'Nature & Wildlife', icon: '🌿', color: '#00D2D3' },
  { value: 'other', label: 'Other Experiences', icon: '✨', color: '#FF6348' }
];

export const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'sw', label: 'Kiswahili', flag: '🇹🇿' }
];

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: '#27AE60', icon: '😊' },
  { value: 'moderate', label: 'Moderate', color: '#F39C12', icon: '🤔' },
  { value: 'challenging', label: 'Challenging', color: '#E74C3C', icon: '💪' }
];

export const PAYMENT_METHODS = [
  { 
    value: 'mtn_momo', 
    label: 'MTN Mobile Money', 
    icon: require('../../assets/icons/mtn-logo.png'),
    color: '#FFCC00'
  },
  { 
    value: 'airtel_money', 
    label: 'Airtel Money', 
    icon: require('../../assets/icons/airtel-logo.png'),
    color: '#ED1C24'
  },
  { 
    value: 'card', 
    label: 'Credit/Debit Card', 
    icon: '💳',
    color: '#3498DB'
  },
  { 
    value: 'cash', 
    label: 'Cash Payment', 
    icon: '💵',
    color: '#27AE60'
  }
];

export const DIETARY_RESTRICTIONS = [
  'vegetarian',
  'vegan', 
  'halal',
  'kosher',
  'gluten_free',
  'dairy_free',
  'nut_allergy',
  'other'
];

export const CANCELLATION_POLICIES = [
  { 
    value: 'flexible', 
    label: 'Flexible', 
    description: 'Free cancellation up to 24 hours before the experience'
  },
  { 
    value: 'moderate', 
    label: 'Moderate', 
    description: 'Free cancellation up to 48 hours before the experience'
  },
  { 
    value: 'strict', 
    label: 'Strict', 
    description: 'Free cancellation up to 7 days before the experience'
  }
];

export const BOOKING_STATUSES = {
  pending: { label: 'Pending', color: '#F39C12', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: '#27AE60', icon: '✅' },
  cancelled: { label: 'Cancelled', color: '#E74C3C', icon: '❌' },
  completed: { label: 'Completed', color: '#8E44AD', icon: '🎉' },
  no_show: { label: 'No Show', color: '#95A5A6', icon: '👻' }
};

export const PAYMENT_STATUSES = {
  pending: { label: 'Pending', color: '#F39C12', icon: '⏳' },
  paid: { label: 'Paid', color: '#27AE60', icon: '✅' },
  partially_paid: { label: 'Partially Paid', color: '#3498DB', icon: '💰' },
  refunded: { label: 'Refunded', color: '#9B59B6', icon: '↩️' },
  failed: { label: 'Failed', color: '#E74C3C', icon: '❌' }
};

// Rwanda Cultural Colors (inspired by Imigongo art)
export const COLORS = {
  // Primary colors from Rwandan flag and culture
  primary: '#00A1DE', // Blue from flag
  secondary: '#FFCC00', // Yellow from flag  
  accent: '#009639', // Green from flag
  
  // Imigongo art inspired colors
  earthBrown: '#8B4513',
  clayRed: '#CD853F',
  naturalBeige: '#F5DEB3',
  
  // UI colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  border: '#E5E5E5',
  error: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
  info: '#3498DB',
  
  // Gradient colors
  gradientStart: '#00A1DE',
  gradientEnd: '#009639',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SIZES = {
  // Global sizes
  base: 16,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 20,

  // Font sizes
  largeTitle: 32,
  title1: 28,
  title2: 22,
  title3: 18,
  headline: 17,
  body: 16,
  callout: 15,
  subhead: 14,
  footnote: 13,
  caption1: 12,
  caption2: 11,

  // App dimensions
  width: 375,
  height: 812,
};

// Default user interests for tourists
export const DEFAULT_INTERESTS = [
  'cooking',
  'crafts', 
  'village_tours',
  'storytelling',
  'traditional_dance',
  'music',
  'agriculture',
  'history',
  'nature'
];

// Default skills for local hosts
export const DEFAULT_SKILLS = [
  'Traditional Cooking',
  'Basket Weaving',
  'Pottery',
  'Storytelling',
  'Traditional Dance',
  'Music Performance',
  'Agriculture',
  'Tour Guiding',
  'Cultural History',
  'Nature Guiding'
];

// App configuration
export const APP_CONFIG = {
  name: 'Meet a Rwandan Local',
  version: '1.0.0',
  supportEmail: 'support@meetarwandanlocal.com',
  privacyPolicyUrl: 'https://meetarwandanlocal.com/privacy',
  termsOfServiceUrl: 'https://meetarwandanlocal.com/terms',
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxImagesPerActivity: 10,
  minBookingAdvance: 24, // hours
  maxBookingAdvance: 365, // days
};