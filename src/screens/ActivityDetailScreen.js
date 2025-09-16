import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import {Calendar} from 'react-native-calendars';

const {width} = Dimensions.get('window');

const ActivityDetailScreen = ({navigation, route}) => {
  const {user} = useAuth();
  const {t, language} = useLanguage();
  const {activity} = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock data - replace with actual API call
  const activityDetails = {
    ...activity,
    description: 'Learn to cook traditional Rwandan dishes with a local chef. This hands-on experience will teach you the secrets of Rwandan cuisine, from preparing ingredients to cooking techniques passed down through generations.',
    fullDescription: 'Join Mukamana Grace in her home kitchen for an authentic Rwandan cooking experience. You\'ll learn to prepare traditional dishes like Ugali, Isombe, and Akabenz. The class includes ingredient shopping at the local market, hands-on cooking, and enjoying the meal together. All ingredients and equipment are provided.',
    duration: '3 hours',
    groupSize: '2-6 people',
    includes: [
      'All ingredients and equipment',
      'Recipe cards to take home',
      'Market tour',
      'Traditional meal',
      'Cultural stories and tips'
    ],
    requirements: [
      'Comfortable clothing',
      'Closed-toe shoes',
      'Appetite for learning'
    ],
    hostInfo: {
      name: activity.host,
      rating: 4.8,
      totalReviews: 45,
      joinedDate: '2022-01-15',
      languages: ['English', 'Kinyarwanda'],
      verified: true,
      bio: 'Passionate about sharing Rwandan culture through food. I\'ve been cooking traditional dishes for over 20 years and love teaching others about our rich culinary heritage.',
    },
    reviews: [
      {
        id: '1',
        user: 'Sarah M.',
        rating: 5,
        date: '2023-10-15',
        comment: 'Amazing experience! Grace is a wonderful teacher and the food was delicious. Highly recommend!',
      },
      {
        id: '2',
        user: 'John D.',
        rating: 4,
        date: '2023-10-10',
        comment: 'Great way to learn about Rwandan culture. The market tour was especially interesting.',
      },
    ],
    availableDates: {
      '2024-01-15': {marked: true, dotColor: '#2E7D32'},
      '2024-01-16': {marked: true, dotColor: '#2E7D32'},
      '2024-01-17': {marked: true, dotColor: '#2E7D32'},
      '2024-01-18': {marked: true, dotColor: '#2E7D32'},
      '2024-01-19': {marked: true, dotColor: '#2E7D32'},
    }
  };

  const handleBookNow = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book this activity');
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    Alert.alert(
      'Booking Confirmed!',
      `Your booking for ${activityDetails.title} on ${selectedDate} has been confirmed. You will receive a confirmation email shortly.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowBookingModal(false);
            navigation.navigate('Bookings');
          }
        }
      ]
    );
  };

  const renderBookingModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Book Activity</Text>
          <TouchableOpacity onPress={() => setShowBookingModal(false)}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <Text style={styles.activityTitle}>{activityDetails.title}</Text>
          <Text style={styles.activityPrice}>RWF {activityDetails.price.toLocaleString()}</Text>

          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowCalendar(!showCalendar)}>
            <Icon name="calendar-today" size={20} color="#2E7D32" />
            <Text style={styles.dateText}>
              {selectedDate || 'Choose a date'}
            </Text>
          </TouchableOpacity>

          {showCalendar && (
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={{
                ...activityDetails.availableDates,
                [selectedDate]: {
                  ...activityDetails.availableDates[selectedDate],
                  selected: true,
                  selectedColor: '#2E7D32',
                }
              }}
              theme={{
                selectedDayBackgroundColor: '#2E7D32',
                todayTextColor: '#2E7D32',
                arrowColor: '#2E7D32',
              }}
            />
          )}

          <View style={styles.bookingSummary}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Activity:</Text>
              <Text style={styles.summaryValue}>{activityDetails.title}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{selectedDate || 'Not selected'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price:</Text>
              <Text style={styles.summaryValue}>RWF {activityDetails.price.toLocaleString()}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.confirmButton, !selectedDate && styles.confirmButtonDisabled]}
            onPress={handleConfirmBooking}
            disabled={!selectedDate}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image source={{uri: activityDetails.image}} style={styles.mainImage} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Icon name="favorite-border" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Activity Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{activityDetails.title}</Text>
          <Text style={styles.host}>by {activityDetails.host}</Text>

          <View style={styles.ratingContainer}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={activityDetails.rating}
              starSize={20}
              fullStarColor="#FFD700"
              emptyStarColor="#E0E0E0"
            />
            <Text style={styles.ratingText}>
              {activityDetails.rating} ({activityDetails.hostInfo.totalReviews} reviews)
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>RWF {activityDetails.price.toLocaleString()}</Text>
            <Text style={styles.pricePer}>per person</Text>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <Icon name="access-time" size={20} color="#2E7D32" />
              <Text style={styles.infoText}>{activityDetails.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="group" size={20} color="#2E7D32" />
              <Text style={styles.infoText}>{activityDetails.groupSize}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="location-on" size={20} color="#2E7D32" />
              <Text style={styles.infoText}>{activityDetails.location}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this experience</Text>
            <Text style={styles.description}>{activityDetails.fullDescription}</Text>
          </View>

          {/* What's Included */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's included</Text>
            {activityDetails.includes.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Icon name="check" size={16} color="#2E7D32" />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What to bring</Text>
            {activityDetails.requirements.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Icon name="info" size={16} color="#FF6B35" />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Host Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meet your host</Text>
            <View style={styles.hostCard}>
              <View style={styles.hostHeader}>
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>{activityDetails.hostInfo.name}</Text>
                  <View style={styles.hostRating}>
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      rating={activityDetails.hostInfo.rating}
                      starSize={16}
                      fullStarColor="#FFD700"
                      emptyStarColor="#E0E0E0"
                    />
                    <Text style={styles.hostRatingText}>
                      {activityDetails.hostInfo.rating} ({activityDetails.hostInfo.totalReviews} reviews)
                    </Text>
                  </View>
                  {activityDetails.hostInfo.verified && (
                    <View style={styles.verifiedBadge}>
                      <Icon name="verified" size={16} color="#2E7D32" />
                      <Text style={styles.verifiedText}>Verified Host</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={() => navigation.navigate('Messages')}>
                  <Icon name="message" size={20} color="#2E7D32" />
                </TouchableOpacity>
              </View>
              <Text style={styles.hostBio}>{activityDetails.hostInfo.bio}</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {activityDetails.reviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <View style={styles.reviewRating}>
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      rating={review.rating}
                      starSize={14}
                      fullStarColor="#FFD700"
                      emptyStarColor="#E0E0E0"
                    />
                  </View>
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.bottomPrice}>RWF {activityDetails.price.toLocaleString()}</Text>
          <Text style={styles.bottomPricePer}>per person</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {showBookingModal && renderBookingModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  host: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  pricePer: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  hostCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
  },
  hostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  hostRatingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    padding: 10,
  },
  hostBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceInfo: {
    flex: 1,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bottomPricePer: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  activityPrice: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  bookingSummary: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActivityDetailScreen;