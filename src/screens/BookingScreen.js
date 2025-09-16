import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Title, Paragraph, Button, Chip, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';

const BookingScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    // Mock data - in real app, this would come from API
    setBookings({
      upcoming: [
        {
          id: 1,
          activity: {
            title: 'Traditional Cooking Class',
            host: 'Marie Uwimana',
            image: 'https://via.placeholder.com/100x100',
            location: 'Kigali',
          },
          date: '2024-02-15',
          time: '10:00',
          guests: 2,
          totalPrice: 30000,
          status: 'confirmed',
          bookingDate: '2024-01-20',
        },
        {
          id: 2,
          activity: {
            title: 'Imigongo Art Workshop',
            host: 'Jean Baptiste',
            image: 'https://via.placeholder.com/100x100',
            location: 'Huye',
          },
          date: '2024-02-20',
          time: '14:00',
          guests: 1,
          totalPrice: 20000,
          status: 'pending',
          bookingDate: '2024-01-25',
        },
      ],
      past: [
        {
          id: 3,
          activity: {
            title: 'Village Tour & Storytelling',
            host: 'Grace Mukamana',
            image: 'https://via.placeholder.com/100x100',
            location: 'Musanze',
          },
          date: '2024-01-10',
          time: '09:00',
          guests: 3,
          totalPrice: 75000,
          status: 'completed',
          bookingDate: '2024-01-05',
          rating: 5,
          review: 'Amazing experience! Highly recommend.',
        },
        {
          id: 4,
          activity: {
            title: 'Intore Dance Performance',
            host: 'Paul Nkurunziza',
            image: 'https://via.placeholder.com/100x100',
            location: 'Kigali',
          },
          date: '2024-01-05',
          time: '16:00',
          guests: 2,
          totalPrice: 24000,
          status: 'completed',
          bookingDate: '2023-12-28',
          rating: 4,
          review: 'Great performance, very educational.',
        },
      ],
      cancelled: [
        {
          id: 5,
          activity: {
            title: 'Coffee Farm Experience',
            host: 'Francine Mukamana',
            image: 'https://via.placeholder.com/100x100',
            location: 'Huye',
          },
          date: '2024-01-15',
          time: '08:00',
          guests: 2,
          totalPrice: 36000,
          status: 'cancelled',
          bookingDate: '2024-01-10',
          cancellationReason: 'Weather conditions',
        },
      ],
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      case 'completed':
        return colors.info;
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'check-circle';
      case 'pending':
        return 'schedule';
      case 'cancelled':
        return 'cancel';
      case 'completed':
        return 'done-all';
      default:
        return 'help';
    }
  };

  const handleCancelBooking = (booking) => {
    // Show confirmation dialog and handle cancellation
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: () => {
          // Handle cancellation logic
          showMessage({
            message: 'Booking cancelled successfully',
            type: 'success',
          });
        }},
      ]
    );
  };

  const handleRescheduleBooking = (booking) => {
    navigation.navigate('ActivityDetail', {
      activity: booking.activity,
      reschedule: true,
      bookingId: booking.id,
    });
  };

  const handleLeaveReview = (booking) => {
    navigation.navigate('ReviewScreen', {
      activity: booking.activity,
      bookingId: booking.id,
    });
  };

  const renderBooking = ({item}) => (
    <Card style={styles.bookingCard}>
      <Card.Content>
        <View style={styles.bookingHeader}>
          <Image source={{uri: item.activity.image}} style={styles.activityImage} />
          <View style={styles.bookingInfo}>
            <Text style={styles.activityTitle}>{item.activity.title}</Text>
            <Text style={styles.hostName}>by {item.activity.host}</Text>
            <View style={styles.statusContainer}>
              <Icon
                name={getStatusIcon(item.status)}
                size={16}
                color={getStatusColor(item.status)}
              />
              <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {new Date(item.date).toLocaleDateString()} at {item.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.activity.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="group" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.guests} guest(s)</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="attach-money" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>RWF {item.totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        {item.review && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Your Review:</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="star"
                  size={16}
                  color={star <= item.rating ? colors.secondary : colors.border}
                />
              ))}
            </View>
            <Text style={styles.reviewText}>{item.review}</Text>
          </View>
        )}

        {item.cancellationReason && (
          <View style={styles.cancellationSection}>
            <Text style={styles.cancellationLabel}>Cancellation Reason:</Text>
            <Text style={styles.cancellationText}>{item.cancellationReason}</Text>
          </View>
        )}

        <View style={styles.bookingActions}>
          {item.status === 'confirmed' && (
            <>
              <Button
                mode="outlined"
                onPress={() => handleRescheduleBooking(item)}
                style={styles.actionButton}
                compact>
                Reschedule
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleCancelBooking(item)}
                style={[styles.actionButton, styles.cancelButton]}
                compact>
                Cancel
              </Button>
            </>
          )}
          
          {item.status === 'pending' && (
            <Button
              mode="outlined"
              onPress={() => handleCancelBooking(item)}
              style={[styles.actionButton, styles.cancelButton]}
              compact>
              Cancel
            </Button>
          )}

          {item.status === 'completed' && !item.review && (
            <Button
              mode="contained"
              onPress={() => handleLeaveReview(item)}
              style={styles.actionButton}
              compact>
              Leave Review
            </Button>
          )}

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('ActivityDetail', {activity: item.activity})}
            style={styles.actionButton}
            compact>
            View Activity
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTabButton = (tab, label) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
      {bookings[tab] && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{bookings[tab].length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const currentBookings = bookings[activeTab] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('booking.title')}</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Explore')}>
          <Icon name="add" size={20} color={colors.primary} />
          <Text style={styles.exploreButtonText}>Book New</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderTabButton('upcoming', t('booking.upcoming'))}
          {renderTabButton('past', t('booking.past'))}
          {renderTabButton('cancelled', t('booking.cancelled'))}
        </ScrollView>
      </View>

      {/* Bookings List */}
      {currentBookings.length > 0 ? (
        <FlatList
          data={currentBookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="event-busy" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>
            {activeTab === 'upcoming' && 'No upcoming bookings'}
            {activeTab === 'past' && 'No past bookings'}
            {activeTab === 'cancelled' && 'No cancelled bookings'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'upcoming' && 'Start exploring activities to book your first experience'}
            {activeTab === 'past' && 'Your completed experiences will appear here'}
            {activeTab === 'cancelled' && 'Cancelled bookings will appear here'}
          </Text>
          {activeTab === 'upcoming' && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Explore')}
              style={styles.exploreButtonLarge}>
              Explore Activities
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
  },
  exploreButtonText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  tabsContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: 20,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.white,
  },
  tabBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 10,
  },
  bookingsList: {
    padding: spacing.lg,
  },
  bookingCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  bookingHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  activityImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  activityTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  hostName: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...typography.body2,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  bookingDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailText: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  reviewSection: {
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  reviewLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  reviewText: {
    ...typography.body2,
    color: colors.text,
    fontStyle: 'italic',
  },
  cancellationSection: {
    backgroundColor: colors.error + '10',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  cancellationLabel: {
    ...typography.body2,
    color: colors.error,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  cancellationText: {
    ...typography.body2,
    color: colors.text,
  },
  bookingActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  cancelButton: {
    borderColor: colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h5,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  exploreButtonLarge: {
    borderRadius: 12,
  },
});

export default BookingScreen;