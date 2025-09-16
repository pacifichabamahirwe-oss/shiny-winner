import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginForm, RegisterForm } from '../types';
import ApiService from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (credentials: LoginForm) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await ApiService.login(credentials);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in AsyncStorage
            await AsyncStorage.setItem('authToken', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData: RegisterForm) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await ApiService.register(userData);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in AsyncStorage
            await AsyncStorage.setItem('authToken', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Remove token from AsyncStorage
          await AsyncStorage.removeItem('authToken');
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });
          
          const token = await AsyncStorage.getItem('authToken');
          
          if (token) {
            // Verify token with backend
            const response = await ApiService.getCurrentUser();
            
            if (response.success && response.data) {
              set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // Token invalid, logout
              await get().logout();
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          await get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);