import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { useActivityStore } from '../../store/activityStore';
import { COLORS, SIZES, ACTIVITY_CATEGORIES, RWANDA_PROVINCES } from '../../constants';
import { Activity } from '../../types';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { 
    activities, 
    featuredActivities, 
    fetchActivities, 
    fetchFeaturedActivities, 
    isLoading 
  } = useActivityStore();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchFeaturedActivities(),
        fetchActivities({ limit: 10 })
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderWelcomeSection = () => (
    <LinearGradient
      colors={[COLORS.primary, COLORS.accent]}
      style={styles.welcomeSection}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeText}>
          {user?.userType === 'tourist' 
            ? `Muraho, ${user.firstName}! 🇷🇼` 
            : `Welcome back, ${user?.firstName}!`}
        </Text>
        <Text style={styles.welcomeSubtext}>
          {user?.userType === 'tourist' 
            ? 'Discover authentic Rwandan experiences' 
            : 'Share your culture with the world'}
        </Text>
      </View>
      {user?.userType === 'local' && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateActivity')}
        >
          <Ionicons name="add" size={24} color={COLORS.surface} />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );

  const renderCategoriesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore by Category</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {ACTIVITY_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[styles.categoryCard, { backgroundColor: category.color + '20' }]}
            onPress={() => navigation.navigate('Search', { category: category.value })}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFeaturedSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Experiences</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search', { featured: true })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={featuredActivities}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <FeaturedActivityCard activity={item} />}
        contentContainerStyle={styles.featuredContainer}
      />
    </View>
  );

  const renderProvincesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore by Province</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.provincesContainer}
      >
        {RWANDA_PROVINCES.map((province) => (
          <TouchableOpacity
            key={province.value}
            style={styles.provinceCard}
            onPress={() => navigation.navigate('Search', { province: province.value })}
          >
            <Image 
              source={require('../../../assets/images/rwanda-provinces.jpg')} 
              style={styles.provinceImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.provinceOverlay}
            >
              <Text style={styles.provinceName}>{province.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const FeaturedActivityCard = ({ activity }: { activity: Activity }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('ActivityDetail', { activityId: activity._id })}
    >
      <Image 
        source={{ uri: activity.images[0] || 'https://via.placeholder.com/300x200' }} 
        style={styles.featuredImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredOverlay}
      >
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {activity.title}
          </Text>
          <View style={styles.featuredInfo}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {activity.averageRating?.toFixed(1) || '0.0'}
              </Text>
            </View>
            <Text style={styles.priceText}>
              {activity.price.amount.toLocaleString()} {activity.price.currency}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={COLORS.surface} />
            <Text style={styles.locationText}>
              {activity.location.city}, {activity.location.province}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderWelcomeSection()}
      {renderCategoriesSection()}
      {renderFeaturedSection()}
      {renderProvincesSection()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 24,
    marginBottom: 20,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: SIZES.title2,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: SIZES.subhead,
    color: COLORS.surface,
    opacity: 0.9,
  },
  createButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.title3,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: SIZES.subhead,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: SIZES.padding,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    marginRight: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: SIZES.caption1,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.text,
  },
  featuredContainer: {
    paddingLeft: SIZES.padding,
  },
  featuredCard: {
    width: width * 0.7,
    height: 200,
    borderRadius: SIZES.radius,
    marginRight: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: SIZES.body,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 8,
  },
  featuredInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: SIZES.footnote,
    color: COLORS.surface,
    marginLeft: 4,
  },
  priceText: {
    fontSize: SIZES.subhead,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: SIZES.footnote,
    color: COLORS.surface,
    marginLeft: 4,
  },
  provincesContainer: {
    paddingLeft: SIZES.padding,
  },
  provinceCard: {
    width: 150,
    height: 120,
    borderRadius: SIZES.radius,
    marginRight: 16,
    overflow: 'hidden',
  },
  provinceImage: {
    width: '100%',
    height: '100%',
  },
  provinceOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 12,
  },
  provinceName: {
    fontSize: SIZES.subhead,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
});

export default HomeScreen;