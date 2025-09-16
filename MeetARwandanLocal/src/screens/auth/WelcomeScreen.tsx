import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      source={require('../../../assets/images/rwanda-landscape.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Meet a{'\n'}Rwandan Local</Text>
            <Text style={styles.subtitle}>
              Discover authentic cultural experiences with local Rwandans
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🏘️</Text>
              <Text style={styles.featureText}>Village Tours</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🍳</Text>
              <Text style={styles.featureText}>Cooking Classes</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎨</Text>
              <Text style={styles.featureText}>Traditional Crafts</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💃</Text>
              <Text style={styles.featureText}>Cultural Dance</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Experience Rwanda's rich culture through the eyes of locals
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: StatusBar.currentHeight || 50,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: SIZES.largeTitle,
    fontWeight: 'bold',
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: SIZES.body,
    color: COLORS.surface,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
    paddingHorizontal: 10,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    color: COLORS.surface,
    fontSize: SIZES.caption1,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingBottom: 60,
  },
  button: {
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.body,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.surface,
    fontSize: SIZES.footnote,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default WelcomeScreen;