import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import LinearGradient from 'react-native-linear-gradient';

const HostProfileScreen = ({navigation, route}) => {
  const {t, language} = useLanguage();
  const {host} = route.params;
  const [hostData, setHostData] = useState({});
  const [activities, setActivities] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadHostData();
  }, []);

  const loadHostData = async () => {
    // Mock data - replace with actual API call
    const mockHostData = {
      ...host,
      bio: 'Passionate about sharing Rwandan culture through authentic experiences. I have been hosting travelers for over 5 years and love introducing them to our rich traditions, delicious food, and warm hospitality.',
      location: 'Kigali, Rwanda',
      languages: ['English', 'Kinyarwanda', 'French'],
      joinedDate: '2019-03-15',
      totalGuests: 150,
      responseRate: 98,
      responseTime: 'within an hour',
      verified: true,
      superHost: true,
    };

    const mockActivities = [
      {
        id: '1',
        title: 'Traditional Rwandan Cooking Class',
        price: 25000,
        rating: 4.8,
        reviews: 45,
        image: 'https://via.placeholder.com/150x100/2E7D32/FFFFFF?text=Cooking',
        duration: '3 hours',
        groupSize: '2-6 people',
      },
      {
        id: '2',
        title: 'Market Tour & Food Tasting',
        price: 15000,
        rating: 4.9,
        reviews: 32,
        image: 'https://via.placeholder.com/150x100/FF6B35/FFFFFF?text=Market',
        duration: '2 hours',
        groupSize: '1-4 people',
      },
    ];

    const mockReviews = [
      {
        id: '1',
        user: 'Sarah M.',
        userImage: 'https://via.placeholder.com/40x40/4A90E2/FFFFFF?text=SM',
        rating: 5,
        date: '2024-01-10',
        comment: 'Grace is an amazing host! Her cooking class was so much fun and I learned so much about Rwandan culture. The food was delicious and she made us feel so welcome.',
        activity: 'Traditional Rwandan Cooking Class',
      },
      {
        id: '2',
        user: 'John D.',
        userImage: 'https://via.placeholder.com/40x40/FF6B35/FFFFFF?text=JD',
        rating: 5,
        date: '2024-01-05',
        comment: 'The market tour was incredible! Grace showed us so many interesting foods and explained the cultural significance of each one. Highly recommend!',
        activity: 'Market Tour & Food Tasting',
      },
    ];

    setHostData(mockHostData);
    setActivities(mockActivities);
    setReviews(mockReviews);
  };

  const handleContactHost = () => {
    navigation.navigate('Messages', {host: hostData.name});
  };

  const handleBookActivity = (activity) => {
    navigation.navigate('ActivityDetail', {activity});
  };

  const renderActivityCard = (activity) => (
    <TouchableOpacity
      key={activity.id}
      style={styles.activityCard}
      onPress={() => handleBookActivity(activity)}>
      <Image source={{uri: activity.image}} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <View style={styles.activityMeta}>
          <View style={styles.ratingContainer}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={activity.rating}
              starSize={14}
              fullStarColor="#FFD700"
              emptyStarColor="#E0E0E0"
            />
            <Text style={styles.ratingText}>
              {activity.rating} ({activity.reviews})
            </Text>
          </View>
          <Text style={styles.price}>RWF {activity.price.toLocaleString()}</Text>
        </View>
        <View style={styles.activityDetails}>
          <View style={styles.detailItem}>
            <Icon name="access-time" size={12} color="#666" />
            <Text style={styles.detailText}>{activity.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="group" size={12} color="#666" />
            <Text style={styles.detailText}>{activity.groupSize}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReviewCard = (review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{uri: review.userImage}} style={styles.reviewerImage} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{review.user}</Text>
          <View style={styles.reviewRating}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={review.rating}
              starSize={12}
              fullStarColor="#FFD700"
              emptyStarColor="#E0E0E0"
            />
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewActivity}>{review.activity}</Text>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Host Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}>
        <View style={styles.hostInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: 'https://via.placeholder.com/120x120/2E7D32/FFFFFF?text=' + (hostData.name?.[0] || 'H')}}
              style={styles.avatar}
            />
            {hostData.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={20} color="#fff" />
              </View>
            )}
          </View>
          
          <Text style={styles.hostName}>{hostData.name}</Text>
          <Text style={styles.hostLocation}>{hostData.location}</Text>
          
          <View style={styles.hostBadges}>
            {hostData.superHost && (
              <View style={styles.badge}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.badgeText}>
                  {language === 'en' ? 'Super Host' : 'Umutwara Mukuru'}
                </Text>
              </View>
            )}
            {hostData.verified && (
              <View style={styles.badge}>
                <Icon name="verified" size={16} color="#2E7D32" />
                <Text style={styles.badgeText}>
                  {language === 'en' ? 'Verified' : 'Wemejwe'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Host Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{hostData.totalGuests || 0}</Text>
          <Text style={styles.statLabel}>
            {language === 'en' ? 'Guests Hosted' : 'Abashyitsi Batwara'}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{hostData.responseRate || 0}%</Text>
          <Text style={styles.statLabel}>
            {language === 'en' ? 'Response Rate' : 'Urwego rwo Gusubiza'}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{hostData.responseTime || 'N/A'}</Text>
          <Text style={styles.statLabel}>
            {language === 'en' ? 'Response Time' : 'Igihe cyo Gusubiza'}
          </Text>
        </View>
      </View>

      {/* Host Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'About' : 'Ibyerekeye'}
        </Text>
        <Text style={styles.bio}>{hostData.bio}</Text>
        
        <View style={styles.languagesContainer}>
          <Text style={styles.languagesTitle}>
            {language === 'en' ? 'Languages' : 'Indimi'}
          </Text>
          <View style={styles.languagesList}>
            {hostData.languages?.map((language, index) => (
              <View key={index} style={styles.languageTag}>
                <Text style={styles.languageText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.joinDateContainer}>
          <Icon name="calendar-today" size={16} color="#666" />
          <Text style={styles.joinDate}>
            {language === 'en' ? 'Joined' : 'Yinjiye'} {new Date(hostData.joinedDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Activities' : 'Imikorere'}
        </Text>
        {activities.map(renderActivityCard)}
      </View>

      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Reviews' : 'Gusuzuma'}
        </Text>
        {reviews.map(renderReviewCard)}
      </View>

      {/* Contact Button */}
      <View style={styles.contactContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactHost}>
          <Icon name="message" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>
            {language === 'en' ? 'Contact Host' : 'Vugana n\'Umutwara'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  hostInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#2E7D32',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  hostName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  hostLocation: {
    fontSize: 16,
    color: '#E8F5E8',
    marginBottom: 15,
  },
  hostBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  badgeText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  section: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  languagesContainer: {
    marginBottom: 20,
  },
  languagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  activityImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  activityDetails: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    marginLeft: 10,
    fontSize: 12,
    color: '#666',
  },
  reviewActivity: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactContainer: {
    padding: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    padding: 18,
    borderRadius: 15,
  },
  contactButtonText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HostProfileScreen;