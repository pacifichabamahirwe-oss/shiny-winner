import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Title, Paragraph, Button, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [nearbyHosts, setNearbyHosts] = useState([]);

  useEffect(() => {
    // Load featured activities and nearby hosts
    loadFeaturedActivities();
    loadNearbyHosts();
  }, []);

  const loadFeaturedActivities = () => {
    // Mock data - in real app, this would come from API
    setFeaturedActivities([
      {
        id: 1,
        title: 'Traditional Cooking Class',
        host: 'Marie Uwimana',
        price: 15000,
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200',
        location: 'Kigali',
        duration: '3 hours',
      },
      {
        id: 2,
        title: 'Imigongo Art Workshop',
        host: 'Jean Baptiste',
        price: 20000,
        rating: 4.9,
        image: 'https://via.placeholder.com/300x200',
        location: 'Huye',
        duration: '4 hours',
      },
      {
        id: 3,
        title: 'Village Tour & Storytelling',
        host: 'Grace Mukamana',
        price: 25000,
        rating: 4.7,
        image: 'https://via.placeholder.com/300x200',
        location: 'Musanze',
        duration: '6 hours',
      },
    ]);
  };

  const loadNearbyHosts = () => {
    // Mock data - in real app, this would come from API
    setNearbyHosts([
      {
        id: 1,
        name: 'Marie Uwimana',
        rating: 4.8,
        activities: 12,
        image: 'https://via.placeholder.com/100x100',
        verified: true,
      },
      {
        id: 2,
        name: 'Jean Baptiste',
        rating: 4.9,
        activities: 8,
        image: 'https://via.placeholder.com/100x100',
        verified: true,
      },
      {
        id: 3,
        name: 'Grace Mukamana',
        rating: 4.7,
        activities: 15,
        image: 'https://via.placeholder.com/100x100',
        verified: false,
      },
    ]);
  };

  const renderFeaturedActivity = (activity) => (
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
            <Icon name="star" size={16} color={colors.secondary} />
            <Text style={styles.rating}>{activity.rating}</Text>
          </View>
          <Text style={styles.price}>RWF {activity.price.toLocaleString()}</Text>
        </View>
        <View style={styles.activityDetails}>
          <Text style={styles.location}>{activity.location}</Text>
          <Text style={styles.duration}>{activity.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyHost = (host) => (
    <TouchableOpacity
      key={host.id}
      style={styles.hostCard}
      onPress={() => navigation.navigate('HostProfile', {host})}>
      <Image source={{uri: host.image}} style={styles.hostImage} />
      <View style={styles.hostInfo}>
        <View style={styles.hostHeader}>
          <Text style={styles.hostName}>{host.name}</Text>
          {host.verified && (
            <Icon name="verified" size={16} color={colors.primary} />
          )}
        </View>
        <View style={styles.hostMeta}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color={colors.secondary} />
            <Text style={styles.hostRating}>{host.rating}</Text>
          </View>
          <Text style={styles.hostActivities}>{host.activities} activities</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('common.welcome')}</Text>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Explore')}>
          <Icon name="search" size={24} color={colors.white} />
          <Text style={styles.quickActionText}>{t('explore.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Booking')}>
          <Icon name="event" size={24} color={colors.white} />
          <Text style={styles.quickActionText}>{t('booking.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Messages')}>
          <Icon name="message" size={24} color={colors.white} />
          <Text style={styles.quickActionText}>{t('messages.title')}</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Activities */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.featuredActivities')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {featuredActivities.map(renderFeaturedActivity)}
        </ScrollView>
      </View>

      {/* Nearby Hosts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.nearbyHosts')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {nearbyHosts.map(renderNearbyHost)}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('explore.categories')}</Text>
        <View style={styles.categoriesGrid}>
          {[
            {name: t('explore.cooking'), icon: 'restaurant', color: colors.primary},
            {name: t('explore.crafts'), icon: 'palette', color: colors.accent},
            {name: t('explore.villageTours'), icon: 'explore', color: colors.secondary},
            {name: t('explore.storytelling'), icon: 'book', color: colors.primaryDark},
            {name: t('explore.traditionalDance'), icon: 'music-note', color: colors.accentDark},
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryCard, {backgroundColor: category.color}]}
              onPress={() => navigation.navigate('Explore', {category: category.name})}>
              <Icon name={category.icon} size={32} color={colors.white} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
    ...typography.body2,
    color: colors.white,
    opacity: 0.9,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginTop: -spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    ...shadows.md,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionText: {
    ...typography.caption,
    color: colors.white,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  seeAllText: {
    ...typography.body2,
    color: colors.primary,
  },
  horizontalScroll: {
    marginHorizontal: -spacing.lg,
  },
  activityCard: {
    width: width * 0.7,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginRight: spacing.md,
    marginLeft: spacing.lg,
    ...shadows.md,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  activityInfo: {
    padding: spacing.md,
  },
  activityTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activityHost: {
    ...typography.body2,
    color: colors.textSecondary,
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
  rating: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  price: {
    ...typography.h6,
    color: colors.primary,
    fontWeight: 'bold',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  hostCard: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.md,
    marginLeft: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  hostImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: spacing.sm,
  },
  hostInfo: {
    alignItems: 'center',
  },
  hostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hostName: {
    ...typography.body2,
    color: colors.text,
    marginRight: spacing.xs,
  },
  hostMeta: {
    alignItems: 'center',
  },
  hostRating: {
    ...typography.caption,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  hostActivities: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - spacing.lg * 3) / 2,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  categoryText: {
    ...typography.body2,
    color: colors.white,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;