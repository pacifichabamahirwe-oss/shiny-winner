import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Title, Paragraph, Button, Chip, Divider, Modal, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Calendar} from 'react-native-calendars';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';
import showMessage from 'react-native-flash-message';

const {width} = Dimensions.get('window');

const ActivityDetailScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {activity} = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [host, setHost] = useState(null);

  useEffect(() => {
    loadHostDetails();
    loadReviews();
  }, []);

  const loadHostDetails = () => {
    // Mock host data - in real app, this would come from API
    setHost({
      id: 1,
      name: activity.host,
      rating: 4.8,
      totalReviews: 156,
      joinedDate: '2022-01-15',
      verified: true,
      languages: ['English', 'Kinyarwanda', 'French'],
      bio: 'Passionate about sharing Rwandan culture and traditions with visitors from around the world.',
      image: 'https://via.placeholder.com/100x100',
    });
  };

  const loadReviews = () => {
    // Mock reviews data - in real app, this would come from API
    setReviews([
      {
        id: 1,
        user: 'Sarah Johnson',
        rating: 5,
        date: '2024-01-15',
        comment: 'Amazing experience! Marie was so welcoming and taught us so much about traditional cooking.',
        avatar: 'https://via.placeholder.com/50x50',
      },
      {
        id: 2,
        user: 'Michael Chen',
        rating: 4,
        date: '2024-01-10',
        comment: 'Great activity, very educational. The food was delicious and the host was knowledgeable.',
        avatar: 'https://via.placeholder.com/50x50',
      },
      {
        id: 3,
        user: 'Emma Wilson',
        rating: 5,
        date: '2024-01-08',
        comment: 'Perfect introduction to Rwandan cuisine. Highly recommend this experience!',
        avatar: 'https://via.placeholder.com/50x50',
      },
    ]);
  };

  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      showMessage({
        message: 'Please select date and time',
        type: 'warning',
      });
      return;
    }

    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    // Mock booking confirmation
    showMessage({
      message: t('success.bookingConfirmed'),
      type: 'success',
    });
    
    setShowBookingModal(false);
    navigation.navigate('Booking');
  };

  const handleContactHost = () => {
    navigation.navigate('Messages', {host: host});
  };

  const renderReview = (review) => (
    <View key={review.id} style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{uri: review.avatar}} style={styles.reviewAvatar} />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewUser}>{review.user}</Text>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="star"
                size={14}
                color={star <= review.rating ? colors.secondary : colors.border}
              />
            ))}
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );

  const renderStarRating = (rating) => {
    return (
      <View style={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={20}
            color={star <= rating ? colors.secondary : colors.border}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Activity Image */}
      <View style={styles.imageContainer}>
        <Image source={{uri: activity.image}} style={styles.activityImage} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="favorite-border" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Activity Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{activity.title}</Text>
          <View style={styles.ratingContainer}>
            {renderStarRating(activity.rating)}
            <Text style={styles.ratingText}>{activity.rating}</Text>
            <Text style={styles.reviewCount}>({activity.reviews} reviews)</Text>
          </View>
        </View>

        <View style={styles.hostInfo}>
          <Image source={{uri: host?.image}} style={styles.hostAvatar} />
          <View style={styles.hostDetails}>
            <View style={styles.hostHeader}>
              <Text style={styles.hostName}>{activity.host}</Text>
              {host?.verified && (
                <Icon name="verified" size={16} color={colors.primary} />
              )}
            </View>
            <Text style={styles.hostRating}>
              {renderStarRating(host?.rating || 0)} {host?.totalReviews} reviews
            </Text>
          </View>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactHost}>
            <Icon name="message" size={16} color={colors.primary} />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>{t('activity.description')}</Title>
            <Paragraph style={styles.description}>{activity.description}</Paragraph>
            
            <Title style={styles.sectionTitle}>{t('activity.whatsIncluded')}</Title>
            <View style={styles.includedList}>
              <View style={styles.includedItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.includedText}>All ingredients and materials</Text>
              </View>
              <View style={styles.includedItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.includedText}>Traditional recipes to take home</Text>
              </View>
              <View style={styles.includedItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.includedText}>Cultural stories and history</Text>
              </View>
              <View style={styles.includedItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.includedText}>Light refreshments</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Activity Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Icon name="access-time" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{activity.duration}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="group" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>Max Guests</Text>
                <Text style={styles.infoValue}>{activity.maxGuests}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="language" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>Languages</Text>
                <Text style={styles.infoValue}>{activity.languages.join(', ')}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="location-on" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{activity.location}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Booking Section */}
        <Card style={styles.bookingCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Book Your Experience</Title>
            
            <View style={styles.bookingForm}>
              <TouchableOpacity
                style={styles.dateTimeSelector}
                onPress={() => setShowCalendar(true)}>
                <Icon name="calendar-today" size={20} color={colors.primary} />
                <View style={styles.selectorContent}>
                  <Text style={styles.selectorLabel}>Date</Text>
                  <Text style={styles.selectorValue}>
                    {selectedDate || 'Select date'}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.timeSelector}>
                <Text style={styles.timeLabel}>Available Times</Text>
                <View style={styles.timeGrid}>
                  {availableTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.selectedTimeSlot,
                      ]}
                      onPress={() => setSelectedTime(time)}>
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime === time && styles.selectedTimeSlotText,
                        ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.guestsSelector}>
                <Text style={styles.guestsLabel}>Number of Guests</Text>
                <View style={styles.guestsControls}>
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => setGuests(Math.max(1, guests - 1))}>
                    <Icon name="remove" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.guestsCount}>{guests}</Text>
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => setGuests(Math.min(activity.maxGuests, guests + 1))}>
                    <Icon name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.priceSection}>
              <View style={styles.priceBreakdown}>
                <Text style={styles.priceLabel}>Price per person</Text>
                <Text style={styles.priceValue}>RWF {activity.price.toLocaleString()}</Text>
              </View>
              <View style={styles.priceBreakdown}>
                <Text style={styles.priceLabel}>Total ({guests} guests)</Text>
                <Text style={styles.totalPrice}>
                  RWF {(activity.price * guests).toLocaleString()}
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleBookNow}
              style={styles.bookButton}
              contentStyle={styles.bookButtonContent}>
              {t('activity.bookNow')}
            </Button>
          </Card.Content>
        </Card>

        {/* Reviews Section */}
        <Card style={styles.reviewsCard}>
          <Card.Content>
            <View style={styles.reviewsHeader}>
              <Title style={styles.sectionTitle}>{t('activity.reviews')}</Title>
              <TouchableOpacity>
                <Text style={styles.writeReviewText}>{t('activity.writeReview')}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.overallRating}>
              <Text style={styles.overallRatingNumber}>{activity.rating}</Text>
              <View style={styles.overallRatingDetails}>
                {renderStarRating(activity.rating)}
                <Text style={styles.overallRatingText}>
                  Based on {activity.reviews} reviews
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            {reviews.map(renderReview)}
          </Card.Content>
        </Card>
      </View>

      {/* Calendar Modal */}
      <Portal>
        <Modal
          visible={showCalendar}
          onDismiss={() => setShowCalendar(false)}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity onPress={() => setShowCalendar(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setShowCalendar(false);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.primary,
              },
            }}
            theme={{
              selectedDayBackgroundColor: colors.primary,
              todayTextColor: colors.primary,
              arrowColor: colors.primary,
            }}
          />
        </Modal>
      </Portal>

      {/* Booking Confirmation Modal */}
      <Portal>
        <Modal
          visible={showBookingModal}
          onDismiss={() => setShowBookingModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.bookingSummary}>
            <Text style={styles.bookingTitle}>{activity.title}</Text>
            <Text style={styles.bookingHost}>Hosted by {activity.host}</Text>
            <Text style={styles.bookingDate}>
              {selectedDate} at {selectedTime}
            </Text>
            <Text style={styles.bookingGuests}>{guests} guest(s)</Text>
            <View style={styles.bookingTotal}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                RWF {(activity.price * guests).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              onPress={() => setShowBookingModal(false)}
              style={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirmBooking}
              style={styles.confirmButton}>
              Confirm & Pay
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  activityImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.body1,
    color: colors.text,
    marginLeft: spacing.sm,
    fontWeight: 'bold',
  },
  reviewCount: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  hostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  hostDetails: {
    flex: 1,
  },
  hostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hostName: {
    ...typography.h6,
    color: colors.text,
    marginRight: spacing.sm,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
  },
  contactButtonText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  detailsCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  infoCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  bookingCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  reviewsCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body1,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  includedList: {
    marginBottom: spacing.lg,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  includedText: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.body2,
    color: colors.text,
    textAlign: 'center',
  },
  bookingForm: {
    marginBottom: spacing.lg,
  },
  dateTimeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  selectorContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  selectorLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectorValue: {
    ...typography.body1,
    color: colors.text,
  },
  timeSelector: {
    marginBottom: spacing.md,
  },
  timeLabel: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    ...typography.body2,
    color: colors.text,
  },
  selectedTimeSlotText: {
    color: colors.white,
  },
  guestsSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestsLabel: {
    ...typography.body2,
    color: colors.text,
  },
  guestsControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestsCount: {
    ...typography.h6,
    color: colors.text,
    marginHorizontal: spacing.md,
  },
  priceSection: {
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  priceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  priceValue: {
    ...typography.body2,
    color: colors.text,
  },
  totalPrice: {
    ...typography.h6,
    color: colors.primary,
    fontWeight: 'bold',
  },
  bookButton: {
    borderRadius: 12,
  },
  bookButtonContent: {
    paddingVertical: spacing.sm,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  writeReviewText: {
    ...typography.body2,
    color: colors.primary,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  overallRatingNumber: {
    ...typography.h2,
    color: colors.text,
    marginRight: spacing.md,
  },
  overallRatingDetails: {
    flex: 1,
  },
  overallRatingText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    marginVertical: spacing.md,
  },
  reviewItem: {
    marginBottom: spacing.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewUser: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '500',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  reviewDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  reviewComment: {
    ...typography.body2,
    color: colors.text,
    lineHeight: 20,
  },
  starRating: {
    flexDirection: 'row',
  },
  modalContainer: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h5,
    color: colors.text,
  },
  bookingSummary: {
    padding: spacing.lg,
  },
  bookingTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bookingHost: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bookingDate: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bookingGuests: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  bookingTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.h6,
    color: colors.text,
  },
  totalAmount: {
    ...typography.h5,
    color: colors.primary,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  confirmButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default ActivityDetailScreen;