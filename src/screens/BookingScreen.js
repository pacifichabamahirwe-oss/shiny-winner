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

const BookingScreen = ({navigation}) => {
  const {t, language} = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    // Mock data - replace with actual API call
    const mockBookings = [
      {
        id: '1',
        activity: {
          title: 'Traditional Rwandan Cooking Class',
          host: 'Mukamana Grace',
          image: 'https://via.placeholder.com/100x100/2E7D32/FFFFFF?text=Cooking',
          location: 'Kigali',
        },
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'confirmed',
        price: 25000,
        guests: 2,
      },
      {
        id: '2',
        activity: {
          title: 'Imigongo Art Workshop',
          host: 'Nkurunziza Jean',
          image: 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=Art',
          location: 'Huye',
        },
        date: '2024-01-20',
        time: '2:00 PM',
        status: 'pending',
        price: 15000,
        guests: 1,
      },
      {
        id: '3',
        activity: {
          title: 'Village Life Experience',
          host: 'Uwimana Marie',
          image: 'https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=Village',
          location: 'Musanze',
        },
        date: '2024-01-10',
        time: '9:00 AM',
        status: 'completed',
        price: 30000,
        guests: 3,
      },
    ];
    setBookings(mockBookings);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#2E7D32';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#4A90E2';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return language === 'en' ? 'Confirmed' : 'Kwemejwe';
      case 'pending':
        return language === 'en' ? 'Pending' : 'Gitegereje';
      case 'completed':
        return language === 'en' ? 'Completed' : 'Byarangiye';
      case 'cancelled':
        return language === 'en' ? 'Cancelled' : 'Byahagaritswe';
      default:
        return status;
    }
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      language === 'en' ? 'Cancel Booking' : 'Hagarika Kwiyandikisha',
      language === 'en' 
        ? 'Are you sure you want to cancel this booking?'
        : 'Urazi neza ko ushaka guhagarika iyi kwiyandikisha?',
      [
        {text: language === 'en' ? 'No' : 'Oya', style: 'cancel'},
        {
          text: language === 'en' ? 'Yes, Cancel' : 'Yego, Hagarika',
          style: 'destructive',
          onPress: () => {
            // Handle cancellation logic
            setBookings(prev => prev.filter(booking => booking.id !== bookingId));
          }
        }
      ]
    );
  };

  const handleContactHost = (host) => {
    navigation.navigate('Messages', {host});
  };

  const renderBookingCard = (booking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <Image source={{uri: booking.activity.image}} style={styles.activityImage} />
      
      <View style={styles.bookingInfo}>
        <Text style={styles.activityTitle}>{booking.activity.title}</Text>
        <Text style={styles.hostName}>by {booking.activity.host}</Text>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="access-time" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.activity.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="group" size={16} color="#666" />
            <Text style={styles.detailText}>
              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
            </Text>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>RWF {booking.price.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, {backgroundColor: getStatusColor(booking.status) + '20'}]}>
              <Text style={[styles.statusText, {color: getStatusColor(booking.status)}]}>
                {getStatusText(booking.status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {booking.status === 'confirmed' && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleContactHost(booking.activity.host)}>
                <Icon name="message" size={16} color="#2E7D32" />
                <Text style={styles.actionButtonText}>
                  {language === 'en' ? 'Message Host' : 'Ohereza ubutumwa'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelBooking(booking.id)}>
                <Icon name="cancel" size={16} color="#F44336" />
                <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                  {language === 'en' ? 'Cancel' : 'Hagarika'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          
          {booking.status === 'pending' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelBooking(booking.id)}>
              <Icon name="cancel" size={16} color="#F44336" />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                {language === 'en' ? 'Cancel' : 'Hagarika'}
              </Text>
            </TouchableOpacity>
          )}

          {booking.status === 'completed' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Review', {booking})}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.actionButtonText}>
                {language === 'en' ? 'Write Review' : 'Andika gusuzuma'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return booking.status === 'confirmed' || booking.status === 'pending';
    } else if (activeTab === 'past') {
      return booking.status === 'completed' || booking.status === 'cancelled';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}>
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            {language === 'en' ? 'Upcoming' : 'Bitegereje'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}>
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            {language === 'en' ? 'Past' : 'Byashize'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="event-busy" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>
              {language === 'en' ? 'No bookings found' : 'Nta kwiyandikisha bivuzwe'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {language === 'en' 
                ? 'Start exploring amazing experiences!'
                : 'Tangira gusura imikorere myiza!'
              }
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Search')}>
              <Text style={styles.exploreButtonText}>
                {language === 'en' ? 'Explore Activities' : 'Sura Imikorere'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {filteredBookings.map(renderBookingCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#2E7D32',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  bookingsList: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
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
  bookingInfo: {
    padding: 15,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  hostName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#E8F5E8',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cancelButtonText: {
    color: '#F44336',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;