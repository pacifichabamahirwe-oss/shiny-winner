import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Calendar} from 'react-native-calendars';

const CreateActivityScreen = ({navigation}) => {
  const {t, language} = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    price: '',
    duration: '',
    groupSize: '',
    language: 'English',
    includes: '',
    requirements: '',
    images: [],
    availableDates: {},
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    {id: 'cooking', label: language === 'en' ? 'Cooking' : 'Guteka'},
    {id: 'crafts', label: language === 'en' ? 'Crafts' : 'Ubwubatsi'},
    {id: 'villageTour', label: language === 'en' ? 'Village Tour' : 'Gukurikirana Umudugudu'},
    {id: 'storytelling', label: language === 'en' ? 'Storytelling' : 'Gusoma Inkuru'},
    {id: 'traditionalDance', label: language === 'en' ? 'Traditional Dance' : 'Urukiramende rw\'umuco'},
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleImageUpload = () => {
    // Implement image upload logic
    Alert.alert('Image Upload', 'Image upload functionality will be implemented');
  };

  const handleDateSelect = (day) => {
    const dateString = day.dateString;
    setFormData(prev => ({
      ...prev,
      availableDates: {
        ...prev.availableDates,
        [dateString]: {
          marked: true,
          dotColor: '#2E7D32',
        }
      }
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your activity has been created successfully! It will be reviewed before going live.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }, 2000);
  };

  const renderCategorySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Category *' : 'Ubwoko *'}
      </Text>
      <View style={styles.categoriesGrid}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              formData.category === category.id && styles.categoryButtonSelected,
            ]}
            onPress={() => handleInputChange('category', category.id)}>
            <Text style={[
              styles.categoryButtonText,
              formData.category === category.id && styles.categoryButtonTextSelected,
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderImageUpload = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Photos' : 'Amashusho'}
      </Text>
      <View style={styles.imageUploadContainer}>
        {formData.images.length === 0 ? (
          <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
            <Icon name="add-a-photo" size={32} color="#2E7D32" />
            <Text style={styles.imageUploadText}>
              {language === 'en' ? 'Add Photos' : 'Ongeraho Amashusho'}
            </Text>
          </TouchableOpacity>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {formData.images.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{uri: image}} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    const newImages = formData.images.filter((_, i) => i !== index);
                    handleInputChange('images', newImages);
                  }}>
                  <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addMoreButton} onPress={handleImageUpload}>
              <Icon name="add" size={24} color="#2E7D32" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );

  const renderCalendar = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Available Dates' : 'Amatariki Ashoboka'}
      </Text>
      <TouchableOpacity
        style={styles.calendarToggle}
        onPress={() => setShowCalendar(!showCalendar)}>
        <Icon name="calendar-today" size={20} color="#2E7D32" />
        <Text style={styles.calendarToggleText}>
          {language === 'en' ? 'Select Available Dates' : 'Hitamo Amatariki Ashoboka'}
        </Text>
        <Icon name={showCalendar ? 'expand-less' : 'expand-more'} size={20} color="#666" />
      </TouchableOpacity>
      
      {showCalendar && (
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={formData.availableDates}
          theme={{
            selectedDayBackgroundColor: '#2E7D32',
            todayTextColor: '#2E7D32',
            arrowColor: '#2E7D32',
          }}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Basic Information' : 'Amakuru y\'ibanze'}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {language === 'en' ? 'Activity Title *' : 'Umutwe w\'Umukorere *'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={language === 'en' ? 'Enter activity title' : 'Andika umutwe w\'umukorere'}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {language === 'en' ? 'Description *' : 'Ibisobanuro *'}
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder={language === 'en' ? 'Describe your activity' : 'Sobanura umukorere wawe'}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {language === 'en' ? 'Location *' : 'Aho *'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={language === 'en' ? 'Where will this take place?' : 'Ni hehe uyu mukorere uzabera?'}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Category Selection */}
        {renderCategorySelector()}

        {/* Pricing and Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Pricing & Details' : 'Igiciro n\'Ibisobanuro'}
          </Text>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>
                {language === 'en' ? 'Price (RWF) *' : 'Igiciro (RWF) *'}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="25000"
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>
                {language === 'en' ? 'Duration' : 'Igihe'}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={language === 'en' ? 'e.g., 3 hours' : 'urugero, amasaha 3'}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>
                {language === 'en' ? 'Group Size' : 'Ubunini bw\'itsinda'}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={language === 'en' ? 'e.g., 2-6 people' : 'urugero, abantu 2-6'}
                value={formData.groupSize}
                onChangeText={(value) => handleInputChange('groupSize', value)}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>
                {language === 'en' ? 'Language' : 'Ururimi'}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="English"
                value={formData.language}
                onChangeText={(value) => handleInputChange('language', value)}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* What's Included */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'What\'s Included' : 'Ibyo Biriho'}
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={language === 'en' ? 'List what guests will receive' : 'Andika ibyo abashyitsi bazahabwa'}
            value={formData.includes}
            onChangeText={(value) => handleInputChange('includes', value)}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'What to Bring' : 'Ibyo Gutwara'}
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={language === 'en' ? 'List what guests should bring' : 'Andika ibyo abashyitsi bagomba gutwara'}
            value={formData.requirements}
            onChangeText={(value) => handleInputChange('requirements', value)}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />
        </View>

        {/* Image Upload */}
        {renderImageUpload()}

        {/* Calendar */}
        {renderCalendar()}

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading 
                ? (language === 'en' ? 'Creating...' : 'Narema...')
                : (language === 'en' ? 'Create Activity' : 'Reka Umukorere')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
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
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryButtonSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E8',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  categoryButtonTextSelected: {
    color: '#2E7D32',
  },
  imageUploadContainer: {
    marginTop: 10,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  imageUploadText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  imagePreview: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  calendarToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  calendarToggleText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  submitContainer: {
    paddingBottom: 30,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateActivityScreen;