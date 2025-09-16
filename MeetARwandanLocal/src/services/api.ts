import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants';
import { 
  ApiResponse, 
  PaginationResponse, 
  User, 
  Activity, 
  Booking, 
  Review, 
  Message,
  LoginForm,
  RegisterForm,
  SearchFilters,
  CreateActivityForm,
  CreateBookingForm
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await this.api.post('/auth/forgot-password', { email });
    return response.data;
  }

  // User APIs
  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.get('/users/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.put('/users/profile', userData);
    return response.data;
  }

  async getUserById(userId: string): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  async searchHosts(filters: {
    province?: string;
    skills?: string[];
    languages?: string[];
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginationResponse<User>> {
    const response = await this.api.get('/users/hosts/search', { params: filters });
    return response.data;
  }

  async uploadProfileImage(imageUri: string): Promise<ApiResponse<{ user: User }>> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const response = await this.api.post('/users/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async submitVerification(documents: {
    idCard: string;
    businessLicense?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.post('/users/verification', documents);
    return response.data;
  }

  // Activity APIs
  async getActivities(filters: SearchFilters & {
    page?: number;
    limit?: number;
  }): Promise<PaginationResponse<Activity>> {
    const response = await this.api.get('/activities', { params: filters });
    return response.data;
  }

  async getActivityById(activityId: string): Promise<ApiResponse<{ activity: Activity }>> {
    const response = await this.api.get(`/activities/${activityId}`);
    return response.data;
  }

  async createActivity(activityData: CreateActivityForm): Promise<ApiResponse<{ activity: Activity }>> {
    const response = await this.api.post('/activities', activityData);
    return response.data;
  }

  async updateActivity(activityId: string, activityData: Partial<Activity>): Promise<ApiResponse<{ activity: Activity }>> {
    const response = await this.api.put(`/activities/${activityId}`, activityData);
    return response.data;
  }

  async deleteActivity(activityId: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/activities/${activityId}`);
    return response.data;
  }

  async getMyActivities(params: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginationResponse<Activity>> {
    const response = await this.api.get('/activities/host/my-activities', { params });
    return response.data;
  }

  async getActivityCategories(): Promise<ApiResponse<{ categories: any[] }>> {
    const response = await this.api.get('/activities/meta/categories');
    return response.data;
  }

  // Booking APIs
  async createBooking(bookingData: CreateBookingForm & { activityId: string }): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await this.api.post('/bookings', bookingData);
    return response.data;
  }

  async getMyBookings(params: {
    status?: string;
    type?: 'tourist' | 'host';
    page?: number;
    limit?: number;
  }): Promise<PaginationResponse<Booking>> {
    const response = await this.api.get('/bookings/my-bookings', { params });
    return response.data;
  }

  async getBookingById(bookingId: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await this.api.get(`/bookings/${bookingId}`);
    return response.data;
  }

  async updateBookingStatus(bookingId: string, data: {
    status: string;
    cancellationReason?: string;
  }): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await this.api.put(`/bookings/${bookingId}/status`, data);
    return response.data;
  }

  async updatePaymentStatus(bookingId: string, data: {
    paymentStatus: string;
    transactionId?: string;
    depositAmount?: number;
    remainingAmount?: number;
  }): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await this.api.put(`/bookings/${bookingId}/payment`, data);
    return response.data;
  }

  async getBookingStats(userType: 'host' | 'tourist'): Promise<ApiResponse<{ summary: any }>> {
    const response = await this.api.get('/bookings/stats/summary', { 
      params: { userType } 
    });
    return response.data;
  }

  // Review APIs
  async createReview(reviewData: {
    bookingId: string;
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
  }): Promise<ApiResponse<{ review: Review }>> {
    const response = await this.api.post('/reviews', reviewData);
    return response.data;
  }

  async getActivityReviews(activityId: string, params: {
    page?: number;
    limit?: number;
    sortBy?: string;
  }): Promise<PaginationResponse<Review> & { ratingDistribution: any }> {
    const response = await this.api.get(`/reviews/activity/${activityId}`, { params });
    return response.data;
  }

  async getHostReviews(hostId: string, params: {
    page?: number;
    limit?: number;
  }): Promise<PaginationResponse<Review>> {
    const response = await this.api.get(`/reviews/host/${hostId}`, { params });
    return response.data;
  }

  async respondToReview(reviewId: string, comment: string): Promise<ApiResponse<{ review: Review }>> {
    const response = await this.api.post(`/reviews/${reviewId}/response`, { comment });
    return response.data;
  }

  async voteReviewHelpful(reviewId: string): Promise<ApiResponse<{ helpfulVotes: number }>> {
    const response = await this.api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  }

  // Message APIs
  async sendMessage(data: {
    receiverId: string;
    content: string;
    messageType?: string;
    metadata?: any;
  }): Promise<ApiResponse<{ message: Message }>> {
    const response = await this.api.post('/messages', data);
    return response.data;
  }

  async getConversations(params: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ conversations: any[] }>> {
    const response = await this.api.get('/messages/conversations', { params });
    return response.data;
  }

  async getMessages(conversationId: string, params: {
    page?: number;
    limit?: number;
  }): Promise<PaginationResponse<Message>> {
    const response = await this.api.get(`/messages/conversation/${conversationId}`, { params });
    return response.data;
  }

  async markMessagesAsRead(conversationId: string): Promise<ApiResponse<void>> {
    const response = await this.api.put(`/messages/conversation/${conversationId}/read`);
    return response.data;
  }

  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    const response = await this.api.get('/messages/unread-count');
    return response.data;
  }

  async deleteMessage(messageId: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/messages/${messageId}`);
    return response.data;
  }

  // Upload APIs
  async uploadImage(imageUri: string, folder: string = 'general'): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${folder}_${Date.now()}.jpg`,
    } as any);

    const response = await this.api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadMultipleImages(imageUris: string[], folder: string = 'general'): Promise<ApiResponse<{ imageUrls: string[] }>> {
    const formData = new FormData();
    
    imageUris.forEach((uri, index) => {
      formData.append('images', {
        uri,
        type: 'image/jpeg',
        name: `${folder}_${Date.now()}_${index}.jpg`,
      } as any);
    });

    const response = await this.api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new ApiService();