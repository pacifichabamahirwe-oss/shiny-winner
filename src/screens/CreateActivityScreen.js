import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TextInput, Button, Card, Title, Paragraph, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';
import showMessage from 'react-native-flash-message';

const CreateActivityScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    maxGuests: '',
    languages: [],
    meetingPoint: '',
    whatsIncluded: '',
    requirements: '',
    photos: [],
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    {id: 'cooking', name: 'Cooking', icon: 'restaurant'},
    {id: 'crafts', name: 'Crafts', icon: 'palette'},
    {id: 'villageTours', name: 'Village Tours', icon: 'explore'},
    {id: 'storytelling', name: 'Storytelling', icon: 'book'},
    {id: 'traditionalDance', name: 'Traditional Dance', icon: 'music-note'},
  ];

  const availableLanguages = [
    'English', 'Kinyarwanda', 'French', 'Swahili', 'German', 'Spanish'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category.id,
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language],
    }));
  };

  const validateForm = () => {
    const {title, category, description, price, duration, maxGuests, languages, meetingPoint} = formData;

    if (!title || !category || !description || !price || !duration || !maxGuests || !meetingPoint) {
      showMessage({
        message: 'Please fill in all required fields',
        type: 'warning',
      });
      return false;
    }

    if (languages.length === 0) {
      showMessage({
        message: 'Please select at least one language',
        type: 'warning',
      });
      return false;
    }

    if (isNaN(price) || price <= 0) {
      showMessage({
        message: 'Please enter a valid price',
        type: 'warning',
      });
      return false;
    }

    if (isNaN(maxGuests) || maxGuests <= 0) {
      showMessage({
        message: 'Please enter a valid number of guests',
        type: 'warning',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock API call - in real app, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showMessage({
        message: t('success.activityCreated'),
        type: 'success',
      });
      
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: 'Failed to create activity. Please try again.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        formData.category === category.id && styles.selectedCategoryCard,
      ]}
      onPress={() => handleCategorySelect(category)}>
      <Icon
        name={category.icon}
        size={32}
        color={formData.category === category.id ? colors.white : colors.primary}
      />
      <Text
        style={[
          styles.categoryText,
          formData.category === category.id && styles.selectedCategoryText,
        ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderLanguage = (language) => (
    <TouchableOpacity
      key={language}
      style={[
        styles.languageChip,
        formData.languages.includes(language) && styles.selectedLanguageChip,
      ]}
      onPress={() => handleLanguageToggle(language)}>
      <Text
        style={[
          styles.languageText,
          formData.languages.includes(language) && styles.selectedLanguageText,
        ]}>
        {language}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Basic Information */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Basic Information</Title>
            
            <TextInput
              label="Activity Title *"
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Traditional Cooking Class"
            />

            <Text style={styles.inputLabel}>Category *</Text>
            <View style={styles.categoriesGrid}>
              {categories.map(renderCategory)}
            </View>

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Describe your activity in detail..."
            />
          </Card.Content>
        </Card>

        {/* Pricing & Details */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Pricing & Details</Title>
            
            <View style={styles.row}>
              <TextInput
                label="Price (RWF) *"
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                placeholder="15000"
              />
              <TextInput
                label="Duration (hours) *"
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                placeholder="3"
              />
            </View>

            <TextInput
              label="Maximum Guests *"
              value={formData.maxGuests}
              onChangeText={(value) => handleInputChange('maxGuests', value)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              placeholder="8"
            />

            <Text style={styles.inputLabel}>Languages Offered *</Text>
            <View style={styles.languagesContainer}>
              {availableLanguages.map(renderLanguage)}
            </View>
          </Card.Content>
        </Card>

        {/* Location & Logistics */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Location & Logistics</Title>
            
            <TextInput
              label="Meeting Point *"
              value={formData.meetingPoint}
              onChangeText={(value) => handleInputChange('meetingPoint', value)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Kigali City Center, near Hotel des Mille Collines"
            />

            <TextInput
              label="What's Included"
              value={formData.whatsIncluded}
              onChangeText={(value) => handleInputChange('whatsIncluded', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="List what guests will receive (materials, food, etc.)"
            />

            <TextInput
              label="Requirements"
              value={formData.requirements}
              onChangeText={(value) => handleInputChange('requirements', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Any special requirements or recommendations for guests"
            />
          </Card.Content>
        </Card>

        {/* Photos */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Photos</Title>
            <Paragraph style={styles.sectionDescription}>
              Add photos to showcase your activity. You can add up to 10 photos.
            </Paragraph>
            
            <TouchableOpacity style={styles.addPhotoButton}>
              <Icon name="add-a-photo" size={32} color={colors.primary} />
              <Text style={styles.addPhotoText}>Add Photos</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Safety Guidelines */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Safety Guidelines</Title>
            <Paragraph style={styles.sectionDescription}>
              Please ensure your activity follows all safety guidelines:
            </Paragraph>
            
            <View style={styles.guidelinesList}>
              <View style={styles.guidelineItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Provide clear meeting instructions
                </Text>
              </View>
              <View style={styles.guidelineItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Ensure all materials are safe and clean
                </Text>
              </View>
              <View style={styles.guidelineItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Be available for guest questions
                </Text>
              </View>
              <View style={styles.guidelineItem}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.guidelineText}>
                  Follow local health and safety regulations
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}>
            Create Activity
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: spacing.lg,
  },
  sectionCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  categoryCard: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedCategoryCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.body2,
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: colors.white,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  languageChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedLanguageChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageText: {
    ...typography.body2,
    color: colors.text,
  },
  selectedLanguageText: {
    color: colors.white,
  },
  addPhotoButton: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addPhotoText: {
    ...typography.body2,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  guidelinesList: {
    marginTop: spacing.md,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  guidelineText: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  submitContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  submitButton: {
    borderRadius: 12,
  },
  submitButtonContent: {
    paddingVertical: spacing.sm,
  },
});

export default CreateActivityScreen;