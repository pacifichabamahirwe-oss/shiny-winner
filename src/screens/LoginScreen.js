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
import {TextInput, Button, Card, Title, Paragraph} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';
import showMessage from 'react-native-flash-message';

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage({
        message: t('errors.required'),
        type: 'danger',
      });
      return;
    }

    setLoading(true);
    try {
      // Mock login - in real app, this would call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showMessage({
        message: t('success.loginSuccess'),
        type: 'success',
      });
      
      navigation.replace('MainTabs');
    } catch (error) {
      showMessage({
        message: t('errors.invalidCredentials'),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = () => {
    // Toggle between English and Kinyarwanda
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'rw' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="home" size={48} color={colors.white} />
          </View>
          <Text style={styles.appName}>{t('home.title')}</Text>
          <Text style={styles.tagline}>{t('home.subtitle')}</Text>
        </View>

        {/* Login Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>{t('auth.loginTitle')}</Title>
            <Paragraph style={styles.formSubtitle}>
              {t('auth.loginSubtitle')}
            </Paragraph>

            <TextInput
              label={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label={t('auth.password')}
              value={password}
              onChangeText={setPassword}
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                {t('auth.forgotPassword')}
              </Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}>
              {t('auth.signIn')}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}>
              {t('auth.signUp')}
            </Button>
          </Card.Content>
        </Card>

        {/* Language Toggle */}
        <TouchableOpacity style={styles.languageButton} onPress={handleLanguageChange}>
          <Icon name="language" size={20} color={colors.primary} />
          <Text style={styles.languageText}>
            {i18n.language === 'en' ? 'Kinyarwanda' : 'English'}
          </Text>
        </TouchableOpacity>

        {/* Demo Login */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo Accounts</Text>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setEmail('tourist@demo.com');
              setPassword('password123');
            }}>
            <Text style={styles.demoButtonText}>Tourist Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setEmail('host@demo.com');
              setPassword('password123');
            }}>
            <Text style={styles.demoButtonText}>Host Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setEmail('admin@demo.com');
              setPassword('password123');
            }}>
            <Text style={styles.demoButtonText}>Admin Demo</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  appName: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    ...shadows.md,
    borderRadius: 16,
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
  input: {
    marginBottom: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.body2,
    color: colors.primary,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  registerButton: {
    marginBottom: spacing.lg,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  languageText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  demoSection: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  demoTitle: {
    ...typography.h6,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  demoButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  demoButtonText: {
    ...typography.body2,
    color: colors.white,
    textAlign: 'center',
  },
});

export default LoginScreen;