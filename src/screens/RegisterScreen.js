import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TextInput, Button, Card, Title, Paragraph, RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';
import showMessage from 'react-native-flash-message';

const RegisterScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tourist', // 'tourist' or 'local'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const {firstName, lastName, email, phone, password, confirmPassword} = formData;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      showMessage({
        message: t('errors.required'),
        type: 'danger',
      });
      return false;
    }

    if (password !== confirmPassword) {
      showMessage({
        message: t('errors.passwordsNotMatch'),
        type: 'danger',
      });
      return false;
    }

    if (password.length < 6) {
      showMessage({
        message: t('errors.weakPassword'),
        type: 'danger',
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock registration - in real app, this would call API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showMessage({
        message: t('success.accountCreated'),
        type: 'success',
      });
      
      navigation.replace('MainTabs');
    } catch (error) {
      showMessage({
        message: t('errors.emailExists'),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('auth.registerTitle')}</Text>
        </View>

        {/* Registration Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>{t('auth.registerTitle')}</Title>
            <Paragraph style={styles.formSubtitle}>
              {t('auth.registerSubtitle')}
            </Paragraph>

            {/* User Type Selection */}
            <View style={styles.userTypeSection}>
              <Text style={styles.sectionLabel}>{t('auth.userType')}</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleInputChange('userType', 'tourist')}>
                  <RadioButton
                    value="tourist"
                    status={formData.userType === 'tourist' ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange('userType', 'tourist')}
                  />
                  <View style={styles.radioContent}>
                    <Icon name="explore" size={24} color={colors.primary} />
                    <Text style={styles.radioText}>{t('auth.tourist')}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleInputChange('userType', 'local')}>
                  <RadioButton
                    value="local"
                    status={formData.userType === 'local' ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange('userType', 'local')}
                  />
                  <View style={styles.radioContent}>
                    <Icon name="home" size={24} color={colors.primary} />
                    <Text style={styles.radioText}>{t('auth.local')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Personal Information */}
            <View style={styles.nameRow}>
              <TextInput
                label={t('auth.firstName')}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                left={<TextInput.Icon icon="account" />}
              />
              <TextInput
                label={t('auth.lastName')}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                left={<TextInput.Icon icon="account" />}
              />
            </View>

            <TextInput
              label={t('auth.email')}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label={t('auth.phone')}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              label={t('auth.password')}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label={t('auth.confirmPassword')}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}>
              {t('auth.signUp')}
            </Button>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>{t('auth.alreadyHaveAccount')} </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>{t('auth.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Terms and Privacy */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
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
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  formCard: {
    ...shadows.md,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  userTypeSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.md,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  radioText: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: spacing.md,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '500',
  },
  termsSection: {
    padding: spacing.md,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;