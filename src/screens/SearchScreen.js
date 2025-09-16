import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchScreen = ({navigation, route}) => {
  const {t} = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    location: '',
    language: '',
    rating: '',
  });

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (route?.params?.category) {
      setFilters(prev => ({...prev, category: route.params.category}));
    }
  }, [route?.params?.category]);

  useEffect(() => {
    filterActivities();
  }, [searchQuery, filters, activities]);

  const loadActivities = async () => {
    // Mock data - replace with actual API call
    const mockActivities = [
      {
        id: '1',
        title: 'Traditional Rwandan Cooking Class',
        host: 'Mukamana Grace',
        location: 'Kigali',
        price: 25000,
        rating: 4.8,
        reviews: 45,
        image: 'https://via.placeholder.com/300x200/2E7D32/FFFFFF?text=Cooking',
        category: 'cooking',
        language: 'English',
        duration: '3 hours',
        description: 'Learn to cook traditional Rwandan dishes with a local chef.',
      },
      {
        id: '2',
        title: 'Imigongo Art Workshop',
        host: 'Nkurunziza Jean',
        location: 'Huye',
        price: 15000,
        rating: 4.9,
        reviews: 32,
        image: 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Art',
        category: 'crafts',
        language: 'Kinyarwanda',
        duration: '2 hours',
        description: 'Create beautiful Imigongo art pieces using traditional techniques.',
      },
      {
        id: '3',
        title: 'Village Life Experience',
        host: 'Uwimana Marie',
        location: 'Musanze',
        price: 30000,
        rating: 4.7,
        reviews: 28,
        image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Village',
        category: 'villageTour',
        language: 'English',
        duration: 'Full day',
        description: 'Experience authentic village life in rural Rwanda.',
      },
      {
        id: '4',
        title: 'Traditional Dance Performance',
        host: 'Mukamana Jean Paul',
        location: 'Kigali',
        price: 20000,
        rating: 4.6,
        reviews: 38,
        image: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Dance',
        category: 'traditionalDance',
        language: 'English',
        duration: '1.5 hours',
        description: 'Learn traditional Rwandan dances and their cultural significance.',
      },
      {
        id: '5',
        title: 'Storytelling Session',
        host: 'Nkurunziza Grace',
        location: 'Butare',
        price: 10000,
        rating: 4.9,
        reviews: 25,
        image: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Stories',
        category: 'storytelling',
        language: 'Kinyarwanda',
        duration: '1 hour',
        description: 'Listen to traditional Rwandan folktales and legends.',
      },
    ];
    setActivities(mockActivities);
  };

  const filterActivities = () => {
    let filtered = activities;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(activity => activity.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'low':
          filtered = filtered.filter(activity => activity.price <= 15000);
          break;
        case 'medium':
          filtered = filtered.filter(activity => activity.price > 15000 && activity.price <= 30000);
          break;
        case 'high':
          filtered = filtered.filter(activity => activity.price > 30000);
          break;
      }
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(activity =>
        activity.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Language filter
    if (filters.language) {
      filtered = filtered.filter(activity => activity.language === filters.language);
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(activity => activity.rating >= minRating);
    }

    setFilteredActivities(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      location: '',
      language: '',
      rating: '',
    });
    setSearchQuery('');
  };

  const renderActivityCard = ({item}) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetail', {activity: item})}>
      <Image source={{uri: item.image}} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityHost}>by {item.host}</Text>
        <View style={styles.activityMeta}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
          <Text style={styles.price}>RWF {item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.activityDetails}>
          <View style={styles.detailItem}>
            <Icon name="location-on" size={14} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="access-time" size={14} color="#666" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('filter')}</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Category</Text>
              {['cooking', 'crafts', 'villageTour', 'storytelling', 'traditionalDance'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    filters.category === category && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    category: prev.category === category ? '' : category,
                  }))}>
                  <Text style={[
                    styles.filterOptionText,
                    filters.category === category && styles.filterOptionTextSelected,
                  ]}>
                    {t(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range</Text>
              {[
                {value: 'low', label: `${t('low')} (≤ RWF 15,000)`},
                {value: 'medium', label: `${t('medium')} (RWF 15,000 - 30,000)`},
                {value: 'high', label: `${t('high')} (> RWF 30,000)`},
              ].map(price => (
                <TouchableOpacity
                  key={price.value}
                  style={[
                    styles.filterOption,
                    filters.priceRange === price.value && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    priceRange: prev.priceRange === price.value ? '' : price.value,
                  }))}>
                  <Text style={[
                    styles.filterOptionText,
                    filters.priceRange === price.value && styles.filterOptionTextSelected,
                  ]}>
                    {price.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Language Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Language</Text>
              {['English', 'Kinyarwanda', 'French'].map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.filterOption,
                    filters.language === lang && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    language: prev.language === lang ? '' : lang,
                  }))}>
                  <Text style={[
                    styles.filterOptionText,
                    filters.language === lang && styles.filterOptionTextSelected,
                  ]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Minimum Rating</Text>
              {['4.0', '4.5', '4.8'].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.filterOption,
                    filters.rating === rating && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters(prev => ({
                    ...prev,
                    rating: prev.rating === rating ? '' : rating,
                  }))}>
                  <Text style={[
                    styles.filterOptionText,
                    filters.rating === rating && styles.filterOptionTextSelected,
                  ]}>
                    {rating}+ ⭐
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`${t('search')} activities...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}>
          <Icon name="tune" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
        </Text>
        {(searchQuery || Object.values(filters).some(f => f)) && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Activities List */}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivityCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  activityCard: {
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
    height: 150,
    resizeMode: 'cover',
  },
  activityInfo: {
    padding: 15,
  },
  activityTitle: {
    fontSize: 18,
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
  reviews: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  activityDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  filterOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#2E7D32',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  filterOptionTextSelected: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  clearButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchScreen;