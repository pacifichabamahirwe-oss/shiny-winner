import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    price: 'Price',
    location: 'Location',
    date: 'Date',
    time: 'Time',
    book: 'Book',
    message: 'Message',
    review: 'Review',
    rating: 'Rating',
    
    // Navigation
    home: 'Home',
    search: 'Search',
    bookings: 'Bookings',
    messages: 'Messages',
    profile: 'Profile',
    
    // User types
    tourist: 'Tourist',
    host: 'Host',
    admin: 'Admin',
    
    // Activities
    cooking: 'Cooking',
    crafts: 'Crafts',
    villageTour: 'Village Tour',
    storytelling: 'Storytelling',
    traditionalDance: 'Traditional Dance',
    
    // Profile
    interests: 'Interests',
    language: 'Language',
    budget: 'Budget',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    
    // Booking
    availableDates: 'Available Dates',
    selectDate: 'Select Date',
    confirmBooking: 'Confirm Booking',
    bookingConfirmed: 'Booking Confirmed',
    
    // Messages
    sendMessage: 'Send Message',
    typeMessage: 'Type a message...',
    
    // Reviews
    writeReview: 'Write Review',
    yourRating: 'Your Rating',
    yourReview: 'Your Review',
    
    // Safety
    safetyGuidelines: 'Safety Guidelines',
    verifiedHost: 'Verified Host',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    manageUsers: 'Manage Users',
    manageActivities: 'Manage Activities',
    analytics: 'Analytics',
  },
  rw: {
    // Common
    welcome: 'Murakaza neza',
    login: 'Injira',
    register: 'Kwiyandikisha',
    logout: 'Sohoka',
    save: 'Bika',
    cancel: 'Hagarika',
    search: 'Shakisha',
    filter: 'Shungura',
    price: 'Igiciro',
    location: 'Aho',
    date: 'Itariki',
    time: 'Igihe',
    book: 'Kwiyandikisha',
    message: 'Ubutumwa',
    review: 'Gusuzuma',
    rating: 'Urwego',
    
    // Navigation
    home: 'Urugo',
    search: 'Shakisha',
    bookings: 'Kwiyandikisha',
    messages: 'Ubutumwa',
    profile: 'Umwirondoro',
    
    // User types
    tourist: 'Umukerarugendo',
    host: 'Umutwara',
    admin: 'Umuyobozi',
    
    // Activities
    cooking: 'Guteka',
    crafts: 'Ubwubatsi',
    villageTour: 'Gukurikirana Umudugudu',
    storytelling: 'Gusoma Inkuru',
    traditionalDance: 'Urukiramende rw\'umuco',
    
    // Profile
    interests: 'Ibyifuza',
    language: 'Ururimi',
    budget: 'Amafaranga',
    low: 'Hasi',
    medium: 'Hagati',
    high: 'Hejuru',
    
    // Booking
    availableDates: 'Amatariki Ashoboka',
    selectDate: 'Hitamo Itariki',
    confirmBooking: 'Emeza Kwiyandikisha',
    bookingConfirmed: 'Kwiyandikisha Kwemejwe',
    
    // Messages
    sendMessage: 'Ohereza Ubutumwa',
    typeMessage: 'Andika ubutumwa...',
    
    // Reviews
    writeReview: 'Andika Gusuzuma',
    yourRating: 'Urwego Rwawe',
    yourReview: 'Gusuzuma Rwawe',
    
    // Safety
    safetyGuidelines: 'Amabwiriza Y\'umutekano',
    verifiedHost: 'Umutwara Wemejwe',
    
    // Admin
    adminDashboard: 'Ikibaho Cy\'umuyobozi',
    manageUsers: 'Gucunga Abakoresha',
    manageActivities: 'Gucunga Imikorere',
    analytics: 'Gusuzuma',
  },
};

export const LanguageProvider = ({children}) => {
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};