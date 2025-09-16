import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Title, Paragraph, Chip, Button, Modal, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';

const {width} = Dimensions.get('window');

const ExploreScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    location: '',
    language: '',
    rating: 0,
  });
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    {id: 'cooking', name: t('explore.cooking'), icon: 'restaurant', color: colors.primary},
    {id: 'crafts', name: t('explore.crafts'), icon: 'palette', color: colors.accent},
    {id: 'villageTours', name: t('explore.villageTours'), icon: 'explore', color: colors.secondary},
    {id: 'storytelling', name: t('explore.storytelling'), icon: 'book', color: colors.primaryDark},
    {id: 'traditionalDance', name: t('explore.traditionalDance'), icon: 'music-note', color: colors.accentDark},
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, selectedCategory, filters, sortBy]);

  useEffect(() => {
    // Handle category filter from route params
    if (route.params?.category) {
      const category = categories.find(cat => cat.name === route.params.category);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [route.params]);

  const loadActivities = () => {
    // Mock data - in real app, this would come from API
    const mockActivities = [
      {
        id: 1,
        title: 'Traditional Cooking Class',
        host: 'Marie Uwimana',
        price: 15000,
        rating: 4.8,
        reviews: 24,
        image: 'https://via.placeholder.com/300x200',
        location: 'Kigali',
        duration: '3 hours',
        category: 'cooking',
        languages: ['English', 'Kinyarwanda'],
        maxGuests: 8,
        description: 'Learn to cook traditional Rwandan dishes with a local family.',
      },
      {
        id: 2,
        title: 'Imigongo Art Workshop',
        host: 'Jean Baptiste',
        price: 20000,
        rating: 4.9,
        reviews: 18,
        image: 'https://via.placeholder.com/300x200',
        location: 'Huye',
        duration: '4 hours',
        category: 'crafts',
        languages: ['English', 'French'],
        maxGuests: 6,
        description: 'Create beautiful Imigongo art pieces using traditional techniques.',
      },
      {
        id: 3,
        title: 'Village Tour & Storytelling',
        host: 'Grace Mukamana',
        price: 25000,
        rating: 4.7,
        reviews: 32,
        image: 'https://via.placeholder.com/300x200',
        location: 'Musanze',
        duration: '6 hours',
        category: 'villageTours',
        languages: ['English', 'Kinyarwanda'],
        maxGuests: 12,
        description: 'Explore rural life and listen to traditional stories from elders.',
      },
      {
        id: 4,
        title: 'Intore Dance Performance',
        host: 'Paul Nkurunziza',
        price: 12000,
        rating: 4.6,
        reviews: 15,
        image: 'https://via.placeholder.com/300x200',
        location: 'Kigali',
        duration: '2 hours',
        category: 'traditionalDance',
        languages: ['English'],
        maxGuests: 20,
        description: 'Watch and learn traditional Intore warrior dance.',
      },
      {
        id: 5,
        title: 'Coffee Farm Experience',
        host: 'Francine Mukamana',
        price: 18000,
        rating: 4.9,
        reviews: 28,
        image: 'https://via.placeholder.com/300x200',
        location: 'Huye',
        duration: '5 hours',
        category: 'villageTours',
        languages: ['English', 'Kinyarwanda', 'French'],
        maxGuests: 10,
        description: 'Experience the complete coffee journey from farm to cup.',
      },
    ];
    setActivities(mockActivities);
  };

  const filterActivities = () => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(activity =>
      activity.price >= filters.priceRange[0] && activity.price <= filters.priceRange[1]
    );

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(activity =>
        activity.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(activity => activity.rating >= filters.rating);
    }

    // Sort
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredActivities(filtered);
  };

  const renderActivity = ({item}) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetail', {activity: item})}>
      <Image source={{uri: item.image}} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={colors.secondary} />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
        </View>
        
        <Text style={styles.activityHost}>by {item.host}</Text>
        <Text style={styles.activityDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.activityMeta}>
          <View style={styles.metaItem}>
            <Icon name="location-on" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="access-time" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="group" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>Max {item.maxGuests}</Text>
          </View>
        </View>
        
        <View style={styles.activityFooter}>
          <Text style={styles.price}>RWF {item.price.toLocaleString()}</Text>
          <Button
            mode="contained"
            compact
            style={styles.bookButton}
            onPress={() => navigation.navigate('ActivityDetail', {activity: item})}>
            {t('activity.bookNow')}
          </Button>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryChip,
        selectedCategory === category.id && styles.selectedCategoryChip,
      ]}
      onPress={() => setSelectedCategory(
        selectedCategory === category.id ? null : category.id
      )}>
      <Icon
        name={category.icon}
        size={20}
        color={selectedCategory === category.id ? colors.white : category.color}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category.id && styles.selectedCategoryText,
        ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('explore.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}>
          <Icon name="tune" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}>
        {categories.map(renderCategory)}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>{t('explore.sortBy')}:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {key: 'newest', label: t('explore.newest')},
            {key: 'price', label: t('explore.price')},
            {key: 'rating', label: t('explore.rating')},
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                sortBy === option.key && styles.selectedSortOption,
              ]}
              onPress={() => setSortBy(option.key)}>
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.key && styles.selectedSortOptionText,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredActivities.length} {t('common.activities')} found
        </Text>
      </View>

      {/* Activities List */}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.activitiesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No activities found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />

      {/* Filters Modal */}
      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('explore.filters')}</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.filterLabel}>{t('explore.priceRange')}</Text>
            <Text style={styles.priceRangeText}>
              RWF {filters.priceRange[0].toLocaleString()} - RWF {filters.priceRange[1].toLocaleString()}
            </Text>
            
            <Text style={styles.filterLabel}>{t('explore.location')}</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Enter location"
              value={filters.location}
              onChangeText={(value) => setFilters(prev => ({...prev, location: value}))}
            />
            
            <Text style={styles.filterLabel}>{t('explore.rating')}</Text>
            <View style={styles.ratingFilter}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingOption,
                    filters.rating >= rating && styles.selectedRatingOption,
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    rating: prev.rating === rating ? 0 : rating
                  }))}>
                  <Icon
                    name="star"
                    size={20}
                    color={filters.rating >= rating ? colors.secondary : colors.border}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              onPress={() => {
                setFilters({
                  priceRange: [0, 100000],
                  location: '',
                  language: '',
                  rating: 0,
                });
              }}
              style={styles.resetButton}>
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={() => setShowFilters(false)}
              style={styles.applyButton}>
              Apply Filters
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginRight: spacing.md,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...typography.body1,
  },
  filterButton: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    ...shadows.sm,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  selectedCategoryText: {
    color: colors.white,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sortLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  sortOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSortOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortOptionText: {
    ...typography.body2,
    color: colors.text,
  },
  selectedSortOptionText: {
    color: colors.white,
  },
  resultsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultsText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  activitiesList: {
    padding: spacing.lg,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  activityImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  activityInfo: {
    padding: spacing.lg,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  activityTitle: {
    ...typography.h5,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
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
  reviewCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  activityHost: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  activityDescription: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...typography.h5,
    color: colors.primary,
    fontWeight: 'bold',
  },
  bookButton: {
    borderRadius: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.h5,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  modalContainer: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: 16,
    maxHeight: '80%',
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
  modalContent: {
    padding: spacing.lg,
  },
  filterLabel: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  priceRangeText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...typography.body1,
  },
  ratingFilter: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  ratingOption: {
    marginRight: spacing.sm,
  },
  selectedRatingOption: {
    // Style for selected rating
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  applyButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default ExploreScreen;