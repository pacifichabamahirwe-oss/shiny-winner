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
import {Card, Title, Paragraph, Button, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';

const HostProfileScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {host} = route.params;
  const [hostDetails, setHostDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadHostDetails();
    loadHostActivities();
    loadHostReviews();
  }, []);

  const loadHostDetails = () => {
    // Mock host details - in real app, this would come from API
    setHostDetails({
      id: host.id,
      name: host.name,
      image: host.image,
      verified: host.verified,
      rating: 4.8,
      totalReviews: 156,
      joinedDate: '2022-01-15',
      location: 'Kigali, Rwanda',
      languages: ['English', 'Kinyarwanda', 'French'],
      bio: 'Passionate about sharing Rwandan culture and traditions with visitors from around the world. I have been hosting cultural experiences for over 3 years and love connecting with people from different backgrounds.',
      specialties: ['Traditional Cooking', 'Cultural Tours', 'Art Workshops'],
      responseTime: 'Usually responds within 1 hour',
      totalGuests: 1247,
      superhost: true,
    });
  };

  const loadHostActivities = () => {
    // Mock activities - in real app, this would come from API
    setActivities([
      {
        id: 1,
        title: 'Traditional Cooking Class',
        price: 15000,
        rating: 4.8,
        reviews: 24,
        image: 'https://via.placeholder.com/150x100',
        duration: '3 hours',
        maxGuests: 8,
        category: 'cooking',
      },
      {
        id: 2,
        title: 'Rwandan Culture Immersion',
        price: 25000,
        rating: 4.9,
        reviews: 18,
        image: 'https://via.placeholder.com/150x100',
        duration: '6 hours',
        maxGuests: 12,
        category: 'villageTours',
      },
      {
        id: 3,
        title: 'Traditional Dance Workshop',
        price: 12000,
        rating: 4.7,
        reviews: 15,
        image: 'https://via.placeholder.com/150x100',
        duration: '2 hours',
        maxGuests: 20,
        category: 'traditionalDance',
      },
    ]);
  };

  const loadHostReviews = () => {
    // Mock reviews - in real app, this would come from API
    setReviews([
      {
        id: 1,
        user: 'Sarah Johnson',
        rating: 5,
        date: '2024-01-15',
        comment: 'Marie was an amazing host! She made us feel so welcome and taught us so much about traditional Rwandan cooking. The food was delicious and the experience was unforgettable.',
        avatar: 'https://via.placeholder.com/50x50',
        activity: 'Traditional Cooking Class',
      },
      {
        id: 2,
        user: 'Michael Chen',
        rating: 5,
        date: '2024-01-10',
        comment: 'Excellent cultural immersion experience. Marie is very knowledgeable and passionate about sharing her culture. Highly recommend!',
        avatar: 'https://via.placeholder.com/50x50',
        activity: 'Rwandan Culture Immersion',
      },
      {
        id: 3,
        user: 'Emma Wilson',
        rating: 4,
        date: '2024-01-08',
        comment: 'Great dance workshop! Marie is a wonderful teacher and the traditional dances were beautiful to learn.',
        avatar: 'https://via.placeholder.com/50x50',
        activity: 'Traditional Dance Workshop',
      },
    ]);
  };

  const handleContactHost = () => {
    navigation.navigate('Messages', {host: hostDetails});
  };

  const handleViewActivity = (activity) => {
    navigation.navigate('ActivityDetail', {activity});
  };

  const renderStarRating = (rating) => {
    return (
      <View style={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={16}
            color={star <= rating ? colors.secondary : colors.border}
          />
        ))}
      </View>
    );
  };

  const renderActivity = ({item}) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => handleViewActivity(item)}>
      <Image source={{uri: item.image}} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <View style={styles.activityMeta}>
          <View style={styles.ratingContainer}>
            {renderStarRating(item.rating)}
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
          <Text style={styles.price}>RWF {item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.activityDetails}>
          <Text style={styles.duration}>{item.duration}</Text>
          <Text style={styles.maxGuests}>Max {item.maxGuests}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReview = ({item}) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{uri: item.avatar}} style={styles.reviewAvatar} />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewUser}>{item.user}</Text>
          <View style={styles.reviewMeta}>
            {renderStarRating(item.rating)}
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewActivity}>{item.activity}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  if (!hostDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading host profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Host Header */}
      <View style={styles.hostHeader}>
        <Image source={{uri: hostDetails.image}} style={styles.hostImage} />
        <View style={styles.hostInfo}>
          <View style={styles.hostNameContainer}>
            <Text style={styles.hostName}>{hostDetails.name}</Text>
            {hostDetails.verified && (
              <Icon name="verified" size={20} color={colors.primary} />
            )}
            {hostDetails.superhost && (
              <Chip style={styles.superhostChip} textStyle={styles.superhostText}>
                Superhost
              </Chip>
            )}
          </View>
          
          <View style={styles.hostRating}>
            {renderStarRating(hostDetails.rating)}
            <Text style={styles.ratingText}>{hostDetails.rating}</Text>
            <Text style={styles.reviewCount}>({hostDetails.totalReviews} reviews)</Text>
          </View>
          
          <Text style={styles.hostLocation}>{hostDetails.location}</Text>
          <Text style={styles.hostJoined}>
            Joined {new Date(hostDetails.joinedDate).getFullYear()}
          </Text>
        </View>
      </View>

      {/* Host Bio */}
      <Card style={styles.bioCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About {hostDetails.name}</Title>
          <Paragraph style={styles.bioText}>{hostDetails.bio}</Paragraph>
          
          <View style={styles.specialtiesContainer}>
            <Text style={styles.specialtiesLabel}>Specialties:</Text>
            <View style={styles.specialtiesList}>
              {hostDetails.specialties.map((specialty, index) => (
                <Chip key={index} style={styles.specialtyChip}>
                  {specialty}
                </Chip>
              ))}
            </View>
          </View>
          
          <View style={styles.languagesContainer}>
            <Text style={styles.languagesLabel}>Languages:</Text>
            <Text style={styles.languagesText}>{hostDetails.languages.join(', ')}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Host Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Host Statistics</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="group" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{hostDetails.totalGuests}</Text>
              <Text style={styles.statLabel}>Total Guests</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="rate-review" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{hostDetails.totalReviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="access-time" size={24} color={colors.primary} />
              <Text style={styles.statValue}>1h</Text>
              <Text style={styles.statLabel}>Response Time</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="star" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{hostDetails.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Contact Host */}
      <Card style={styles.contactCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleContactHost}
            style={styles.contactButton}
            contentStyle={styles.contactButtonContent}>
            <Icon name="message" size={20} color={colors.white} />
            <Text style={styles.contactButtonText}>Contact Host</Text>
          </Button>
        </Card.Content>
      </Card>

      {/* Host Activities */}
      <Card style={styles.activitiesCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Hosted Activities</Title>
          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activitiesList}
          />
        </Card.Content>
      </Card>

      {/* Reviews */}
      <Card style={styles.reviewsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Guest Reviews</Title>
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  hostHeader: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    ...shadows.sm,
  },
  hostImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.lg,
  },
  hostInfo: {
    flex: 1,
  },
  hostNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  hostName: {
    ...typography.h5,
    color: colors.text,
    marginRight: spacing.sm,
  },
  superhostChip: {
    backgroundColor: colors.secondary,
    marginLeft: spacing.sm,
  },
  superhostText: {
    color: colors.white,
    fontSize: 10,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  starRating: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  ratingText: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  hostLocation: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  hostJoined: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bioCard: {
    margin: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.md,
  },
  bioText: {
    ...typography.body1,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  specialtiesContainer: {
    marginBottom: spacing.lg,
  },
  specialtiesLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  languagesContainer: {
    marginBottom: spacing.lg,
  },
  languagesLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  languagesText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statValue: {
    ...typography.h5,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contactCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  contactButton: {
    borderRadius: 12,
  },
  contactButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  contactButtonText: {
    ...typography.body1,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  activitiesCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  activitiesList: {
    paddingRight: spacing.lg,
  },
  activityCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  activityImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  activityInfo: {
    padding: spacing.md,
  },
  activityTitle: {
    ...typography.body1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  maxGuests: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  reviewsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
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
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  reviewDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  reviewActivity: {
    ...typography.body2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  reviewComment: {
    ...typography.body2,
    color: colors.text,
    lineHeight: 20,
  },
});

export default HostProfileScreen;