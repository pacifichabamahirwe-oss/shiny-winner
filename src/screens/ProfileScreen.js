import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Title, Paragraph, Button, Switch, List, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';
import showMessage from 'react-native-flash-message';

const ProfileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('tourist'); // 'tourist' or 'local'
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    messages: true,
    promotions: false,
    reviews: true,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    // Mock user data - in real app, this would come from API
    setUser({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+250 788 123 456',
      image: 'https://via.placeholder.com/100x100',
      userType: 'tourist',
      verified: true,
      joinedDate: '2023-06-15',
      location: 'Kigali, Rwanda',
      languages: ['English', 'French'],
      interests: ['Cooking', 'Crafts', 'Cultural Tours'],
      bio: 'Passionate traveler exploring authentic cultural experiences around the world.',
      stats: {
        totalBookings: 12,
        totalReviews: 8,
        averageRating: 4.7,
        favoriteCategories: ['Cooking', 'Village Tours'],
      },
    });
    setUserType('tourist');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  const handleLanguageChange = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'rw' : 'en';
    i18n.changeLanguage(newLang);
    showMessage({
      message: `Language changed to ${newLang === 'en' ? 'English' : 'Kinyarwanda'}`,
      type: 'success',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderStatItem = (label, value, icon) => (
    <View style={styles.statItem}>
      <Icon name={icon} size={24} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderMenuItem = (icon, title, subtitle, onPress, showArrow = true) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={24} color={colors.primary} />
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Icon name="chevron-right" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image source={{uri: user.image}} style={styles.profileImage} />
          <TouchableOpacity style={styles.editImageButton}>
            <Icon name="camera-alt" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            {user.verified && (
              <Icon name="verified" size={20} color={colors.primary} />
            )}
          </View>
          
          <Text style={styles.userType}>
            {userType === 'tourist' ? 'Tourist' : 'Local Host'}
          </Text>
          
          <Text style={styles.userLocation}>{user.location}</Text>
          
          <View style={styles.verificationStatus}>
            <Icon
              name={user.verified ? 'check-circle' : 'pending'}
              size={16}
              color={user.verified ? colors.success : colors.warning}
            />
            <Text style={styles.verificationText}>
              {user.verified ? 'Verified' : 'Pending Verification'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Icon name="edit" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Your Activity</Title>
          <View style={styles.statsContainer}>
            {renderStatItem('Bookings', user.stats.totalBookings, 'event')}
            {renderStatItem('Reviews', user.stats.totalReviews, 'rate-review')}
            {renderStatItem('Rating', user.stats.averageRating, 'star')}
            {renderStatItem('Joined', new Date(user.joinedDate).getFullYear(), 'calendar-today')}
          </View>
        </Card.Content>
      </Card>

      {/* Bio Section */}
      <Card style={styles.bioCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About Me</Title>
          <Paragraph style={styles.bioText}>{user.bio}</Paragraph>
          
          <View style={styles.interestsContainer}>
            <Text style={styles.interestsLabel}>Interests:</Text>
            <View style={styles.interestsList}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.languagesContainer}>
            <Text style={styles.languagesLabel}>Languages:</Text>
            <Text style={styles.languagesText}>{user.languages.join(', ')}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Booking')}>
              <Icon name="event" size={24} color={colors.primary} />
              <Text style={styles.actionText}>My Bookings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Messages')}>
              <Icon name="message" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Messages</Text>
            </TouchableOpacity>
            
            {userType === 'local' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateActivity')}>
                <Icon name="add" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Create Activity</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Explore')}>
              <Icon name="explore" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Settings</Title>
          
          {renderMenuItem(
            'language',
            'Language',
            i18n.language === 'en' ? 'English' : 'Kinyarwanda',
            handleLanguageChange
          )}
          
          <Divider style={styles.divider} />
          
          {renderMenuItem(
            'notifications',
            'Notifications',
            'Manage your notification preferences',
            () => navigation.navigate('NotificationSettings')
          )}
          
          <Divider style={styles.divider} />
          
          {renderMenuItem(
            'help',
            'Help & Support',
            'Get help and contact support',
            () => navigation.navigate('HelpScreen')
          )}
          
          <Divider style={styles.divider} />
          
          {renderMenuItem(
            'info',
            'About',
            'App version and information',
            () => navigation.navigate('AboutScreen')
          )}
          
          <Divider style={styles.divider} />
          
          {renderMenuItem(
            'privacy-tip',
            'Privacy Policy',
            'Read our privacy policy',
            () => navigation.navigate('PrivacyScreen')
          )}
          
          <Divider style={styles.divider} />
          
          {renderMenuItem(
            'description',
            'Terms of Service',
            'Read our terms of service',
            () => navigation.navigate('TermsScreen')
          )}
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <Card style={styles.accountCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account</Title>
          
          {userType === 'local' && (
            <>
              {renderMenuItem(
                'analytics',
                'Analytics',
                'View your hosting analytics',
                () => navigation.navigate('AnalyticsScreen')
              )}
              
              <Divider style={styles.divider} />
              
              {renderMenuItem(
                'account-balance-wallet',
                'Earnings',
                'View your earnings and payouts',
                () => navigation.navigate('EarningsScreen')
              )}
              
              <Divider style={styles.divider} />
            </>
          )}
          
          {renderMenuItem(
            'security',
            'Security',
            'Password and security settings',
            () => navigation.navigate('SecurityScreen')
          )}
          
          <Divider style={styles.divider} />
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Admin Access */}
      {user.email === 'admin@demo.com' && (
        <Card style={styles.adminCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Admin</Title>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AdminDashboard')}
              style={styles.adminButton}>
              Admin Dashboard
            </Button>
          </Card.Content>
        </Card>
      )}
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
  profileHeader: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.h4,
    color: colors.text,
    marginRight: spacing.sm,
  },
  userType: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  userLocation: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
  },
  editButtonText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  statsCard: {
    margin: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h5,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bioCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  bioText: {
    ...typography.body1,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  interestsContainer: {
    marginBottom: spacing.lg,
  },
  interestsLabel: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  interestText: {
    ...typography.body2,
    color: colors.primary,
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
  actionsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  actionText: {
    ...typography.body2,
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  settingsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  menuItemTitle: {
    ...typography.body1,
    color: colors.text,
  },
  menuItemSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    marginVertical: spacing.sm,
  },
  accountCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    ...typography.body1,
    color: colors.error,
    marginLeft: spacing.md,
  },
  adminCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  adminButton: {
    borderRadius: 12,
  },
});

export default ProfileScreen;