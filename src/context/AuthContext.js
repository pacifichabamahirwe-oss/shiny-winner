import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual authentication
      const mockUser = {
        id: '1',
        email: email,
        name: 'John Doe',
        role: 'tourist', // or 'host' or 'admin'
        profile: {
          interests: ['cooking', 'crafts'],
          language: 'English',
          budget: 'medium',
        },
        isVerified: true,
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return {success: true};
    } catch (error) {
      console.error('Login error:', error);
      return {success: false, error: error.message};
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call - replace with actual registration
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: userData.userType || 'tourist',
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return {success: true};
    } catch (error) {
      console.error('Registration error:', error);
      return {success: false, error: error.message};
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = {...user, ...profileData};
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return {success: true};
    } catch (error) {
      console.error('Profile update error:', error);
      return {success: false, error: error.message};
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};