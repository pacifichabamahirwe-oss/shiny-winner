import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Tab Screens
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import BookingsScreen from '../screens/main/BookingsScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Detail Screens
import ActivityDetailScreen from '../screens/activity/ActivityDetailScreen';
import HostProfileScreen from '../screens/profile/HostProfileScreen';
import BookingDetailScreen from '../screens/booking/BookingDetailScreen';
import CreateBookingScreen from '../screens/booking/CreateBookingScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import CreateActivityScreen from '../screens/activity/CreateActivityScreen';
import EditActivityScreen from '../screens/activity/EditActivityScreen';
import ReviewsScreen from '../screens/review/ReviewsScreen';
import WriteReviewScreen from '../screens/review/WriteReviewScreen';

import { RootStackParamList, TabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { user } = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Discover',
          headerTitle: 'Meet a Rwandan Local'
        }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Search' }} 
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
        options={{ 
          title: user?.userType === 'local' ? 'My Bookings' : 'My Trips'
        }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ title: 'Messages' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    // You can add a splash screen component here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Welcome Back' }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Join Us' }} 
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={TabNavigator} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ActivityDetail" 
              component={ActivityDetailScreen} 
              options={{ title: 'Experience Details' }} 
            />
            <Stack.Screen 
              name="HostProfile" 
              component={HostProfileScreen} 
              options={{ title: 'Host Profile' }} 
            />
            <Stack.Screen 
              name="BookingDetail" 
              component={BookingDetailScreen} 
              options={{ title: 'Booking Details' }} 
            />
            <Stack.Screen 
              name="CreateBooking" 
              component={CreateBookingScreen} 
              options={{ title: 'Book Experience' }} 
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen} 
              options={({ route }) => ({ 
                title: route.params?.receiverName || 'Chat' 
              })} 
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen} 
              options={{ title: 'Edit Profile' }} 
            />
            <Stack.Screen 
              name="CreateActivity" 
              component={CreateActivityScreen} 
              options={{ title: 'Create Experience' }} 
            />
            <Stack.Screen 
              name="EditActivity" 
              component={EditActivityScreen} 
              options={{ title: 'Edit Experience' }} 
            />
            <Stack.Screen 
              name="ReviewsScreen" 
              component={ReviewsScreen} 
              options={{ title: 'Reviews' }} 
            />
            <Stack.Screen 
              name="WriteReview" 
              component={WriteReviewScreen} 
              options={{ title: 'Write Review' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;