import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegisterScreen = ({navigation}) => {
  const {register} = useAuth();
  const {language} = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tourist',
    interests: [],
    language: 'English',
    budget: 'medium',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleRegister = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  const interests = [
    {id: 'cooking', label: language === 'en' ? 'Cooking' : 'Guteka'},
    {id: 'crafts', label: language === 'en' ? 'Crafts' : 'Ubwubatsi'},
    {id: 'villageTour', label: language === 'en' ? 'Village Tours' : 'Gukurikirana Umudugudu'},
    {id: 'storytelling', label: language === 'en' ? 'Storytelling' : 'Gusoma Inkuru'},
    {id: 'traditionalDance', label: language === 'en' ? 'Traditional Dance' : 'Urukiramende rw\'umuco'},
  ];

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'en' ? 'Create Account' : 'Kwiyandikisha'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'en' 
              ? 'Join our community of travelers and hosts'
              : 'Jya mu muryango w\'abakoresha n\'abatwara'
            }
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* User Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'I am a:' : 'Ndi:'}
            </Text>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  formData.userType === 'tourist' && styles.userTypeButtonSelected,
                ]}
                onPress={() => handleInputChange('userType', 'tourist')}>
                <Icon 
                  name="explore" 
                  size={24} 
                  color={formData.userType === 'tourist' ? '#fff' : '#2E7D32'} 
                />
                <Text style={[
                  styles.userTypeText,
                  formData.userType === 'tourist' && styles.userTypeTextSelected,
                ]}>
                  {language === 'en' ? 'Tourist' : 'Umukerarugendo'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  formData.userType === 'host' && styles.userTypeButtonSelected,
                ]}
                onPress={() => handleInputChange('userType', 'host')}>
                <Icon 
                  name="home" 
                  size={24} 
                  color={formData.userType === 'host' ? '#fff' : '#2E7D32'} 
                />
                <Text style={[
                  styles.userTypeText,
                  formData.userType === 'host' && styles.userTypeTextSelected,
                ]}>
                  {language === 'en' ? 'Host' : 'Umutwara'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Basic Information' : 'Amakuru y\'ibanze'}
            </Text>
            
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={language === 'en' ? 'Full Name' : 'Amazina yose'}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={language === 'en' ? 'Email Address' : 'Imeli'}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={language === 'en' ? 'Phone Number' : 'Numero ya telefone'}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Password' : 'Ijambo ry\'ibanga'}
            </Text>
            
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={language === 'en' ? 'Password' : 'Ijambo ry\'ibanga'}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={language === 'en' ? 'Confirm Password' : 'Emeza ijambo ry\'ibanga'}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Preferences (for tourists) */}
          {formData.userType === 'tourist' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Your Interests' : 'Ibyifuza byawe'}
              </Text>
              <View style={styles.interestsContainer}>
                {interests.map(interest => (
                  <TouchableOpacity
                    key={interest.id}
                    style={[
                      styles.interestButton,
                      formData.interests.includes(interest.id) && styles.interestButtonSelected,
                    ]}
                    onPress={() => toggleInterest(interest.id)}>
                    <Text style={[
                      styles.interestText,
                      formData.interests.includes(interest.id) && styles.interestTextSelected,
                    ]}>
                      {interest.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputContainer}>
                <Icon name="language" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={language === 'en' ? 'Preferred Language' : 'Ururimi rw\'ukunda'}
                  value={formData.language}
                  onChangeText={(value) => handleInputChange('language', value)}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="attach-money" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={language === 'en' ? 'Budget Range' : 'Amafaranga'}
                  value={formData.budget}
                  onChangeText={(value) => handleInputChange('budget', value)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            <Text style={styles.registerButtonText}>
              {loading 
                ? (language === 'en' ? 'Creating Account...' : 'Narema konti...')
                : (language === 'en' ? 'Create Account' : 'Reka konti')
              }
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              {language === 'en' ? 'Already have an account? ' : 'Ufite konti? '}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>
                {language === 'en' ? 'Sign In' : 'Injira'}
              </Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
  },
  header: {
    padding: 30,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F5E8',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2E7D32',
    backgroundColor: '#fff',
  },
  userTypeButtonSelected: {
    backgroundColor: '#2E7D32',
  },
  userTypeText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  userTypeTextSelected: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 15,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  interestButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E7D32',
    backgroundColor: '#fff',
  },
  interestButtonSelected: {
    backgroundColor: '#2E7D32',
  },
  interestText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  interestTextSelected: {
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#2E7D32',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;