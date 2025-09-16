import { create } from 'zustand';
import { Activity, SearchFilters } from '../types';
import ApiService from '../services/api';

interface ActivityState {
  activities: Activity[];
  featuredActivities: Activity[];
  myActivities: Activity[];
  currentActivity: Activity | null;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };

  // Actions
  fetchActivities: (filters?: SearchFilters, page?: number) => Promise<void>;
  fetchFeaturedActivities: () => Promise<void>;
  fetchMyActivities: (params?: any) => Promise<void>;
  fetchActivityById: (activityId: string) => Promise<void>;
  createActivity: (activityData: any) => Promise<void>;
  updateActivity: (activityId: string, activityData: any) => Promise<void>;
  deleteActivity: (activityId: string) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  featuredActivities: [],
  myActivities: [],
  currentActivity: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  fetchActivities: async (filters = {}, page = 1) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ApiService.getActivities({
        ...filters,
        page,
        limit: get().pagination.limit,
      });

      if (response.success && response.data) {
        const { activities, pagination } = response.data;
        
        set({
          activities: page === 1 ? activities : [...get().activities, ...activities],
          pagination,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch activities',
        isLoading: false,
      });
    }
  },

  fetchFeaturedActivities: async () => {
    try {
      const response = await ApiService.getActivities({
        featured: true,
        limit: 10,
      });

      if (response.success && response.data) {
        set({
          featuredActivities: response.data.activities,
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch featured activities:', error);
    }
  },

  fetchMyActivities: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ApiService.getMyActivities(params);

      if (response.success && response.data) {
        set({
          myActivities: response.data.activities,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch your activities',
        isLoading: false,
      });
    }
  },

  fetchActivityById: async (activityId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ApiService.getActivityById(activityId);

      if (response.success && response.data) {
        set({
          currentActivity: response.data.activity,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch activity details',
        isLoading: false,
      });
    }
  },

  createActivity: async (activityData: any) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ApiService.createActivity(activityData);

      if (response.success && response.data) {
        set({
          myActivities: [response.data.activity, ...get().myActivities],
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create activity',
        isLoading: false,
      });
      throw error;
    }
  },

  updateActivity: async (activityId: string, activityData: any) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ApiService.updateActivity(activityId, activityData);

      if (response.success && response.data) {
        const updatedActivity = response.data.activity;
        
        set({
          myActivities: get().myActivities.map(activity =>
            activity._id === activityId ? updatedActivity : activity
          ),
          currentActivity: get().currentActivity?._id === activityId 
            ? updatedActivity 
            : get().currentActivity,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update activity',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteActivity: async (activityId: string) => {
    try {
      set({ isLoading: true, error: null });

      await ApiService.deleteActivity(activityId);

      set({
        myActivities: get().myActivities.filter(activity => activity._id !== activityId),
        activities: get().activities.filter(activity => activity._id !== activityId),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete activity',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters: SearchFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },
}));