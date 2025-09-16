import {DefaultTheme} from 'react-native-paper';

// Rwanda-inspired color palette based on Imigongo art
export const colors = {
  // Primary colors inspired by Rwanda's flag and Imigongo art
  primary: '#00A651', // Green from Rwanda flag
  primaryDark: '#007A3A',
  primaryLight: '#4DBF7A',
  
  // Secondary colors
  secondary: '#FCD116', // Yellow from Rwanda flag
  secondaryDark: '#E6B800',
  secondaryLight: '#FDE066',
  
  // Accent colors from Imigongo art
  accent: '#E31E24', // Red from Rwanda flag
  accentDark: '#C41E3A',
  accentLight: '#FF6B6B',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  lightGray: '#F8F9FA',
  darkGray: '#343A40',
  
  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  
  // Text colors
  text: '#212529',
  textSecondary: '#6C757D',
  textLight: '#FFFFFF',
  
  // Border colors
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    placeholder: colors.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};

// Typography styles
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  h6: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  body1: {
    fontSize: 16,
    color: colors.text,
  },
  body2: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// Shadow styles
export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default theme;