import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const {user} = useAuth();
  const {t} = useLanguage();
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeaturedActivities();
  }, []);

  const loadFeaturedActivities = async () => {
    // Mock data - replace with actual API call
    const mockActivities = [
      {
        id: '1',
        title: 'Traditional Rwandan Cooking Class',
        host: 'Mukamana Grace',
        location: 'Kigali',
        price: 25000,
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200/2E7D32/FFFFFF?text=Cooking',
        category: 'cooking',
      },
      {
        id: '2',
        title: 'Imigongo Art Workshop',
        host: 'Nkurunziza Jean',
        location: 'Huye',
        price: 15000,
        rating: 4.9,
        image: 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Art',
        category: 'crafts',
      },
      {
        id: '3',
        title: 'Village Life Experience',
        host: 'Uwimana Marie',
        location: 'Musanze',
        price: 30000,
        rating: 4.7,
        image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Village',
        category: 'villageTour',
      },
    ];
    setFeaturedActivities(mockActivities);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedActivities();
    setRefreshing(false);
  };

  const renderActivityCard = (activity) => (
    <TouchableOpacity
      key={activity.id}
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetail', {activity})}>
      <Image source={{uri: activity.image}} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityHost}>by {activity.host}</Text>
        <View style={styles.activityMeta}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{activity.rating}</Text>
          </View>
          <Text style={styles.price}>RWF {activity.price.toLocaleString()}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={14} color="#666" />
          <Text style={styles.location}>{activity.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('Search')}>
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          style={styles.quickActionGradient}>
          <Icon name="search" size={24} color="#fff" />
          <Text style={styles.quickActionText}>{t('search')}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('CreateActivity')}>
        <LinearGradient
          colors={['#FF6B35', '#FF8A65']}
          style={styles.quickActionGradient}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.quickActionText}>Create Activity</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('Messages')}>
        <LinearGradient
          colors={['#4A90E2', '#7BB3F0']}
          style={styles.quickActionGradient}>
          <Icon name="message" size={24} color="#fff" />
          <Text style={styles.quickActionText}>{t('messages')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Welcome Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.welcomeHeader}>
        <Text style={styles.welcomeText}>
          {t('welcome')}, {user?.name || 'Guest'}!
        </Text>
        <Text style={styles.welcomeSubtext}>
          Discover authentic Rwandan experiences
        </Text>
      </LinearGradient>

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Featured Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Experiences</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {featuredActivities.map(renderActivityCard)}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore Categories</Text>
        <View style={styles.categoriesGrid}>
          {[
            {name: t('cooking'), icon: 'restaurant', color: '#2E7D32'},
            {name: t('crafts'), icon: 'palette', color: '#FF6B35'},
            {name: t('villageTour'), icon: 'hiking', color: '#4A90E2'},
            {name: t('storytelling'), icon: 'book', color: '#9C27B0'},
            {name: t('traditionalDance'), icon: 'music-note', color: '#FF9800'},
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryCard, {borderColor: category.color}]}
              onPress={() =>
                navigation.navigate('Search', {category: category.name})
              }>
              <Icon name={category.icon} size={32} color={category.color} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>150+</Text>
          <Text style={styles.statLabel}>Local Hosts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Experiences</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statLabel}>Happy Guests</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  welcomeHeader: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#E8F5E8',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  quickAction: {
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionGradient: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  activityCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  activityInfo: {
    padding: 15,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  activityHost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen;