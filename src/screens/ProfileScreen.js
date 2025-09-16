import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({navigation}) => {
  const {user, logout, updateProfile} = useAuth();
  const {t, language, changeLanguage} = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: logout},
      ]
    );
  };

  const handleLanguageChange = () => {
    changeLanguage(language === 'en' ? 'rw' : 'en');
  };

  const menuItems = [
    {
      id: 'edit-profile',
      title: language === 'en' ? 'Edit Profile' : 'Guhindura Umwirondoro',
      icon: 'edit',
      color: '#2E7D32',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'my-activities',
      title: language === 'en' ? 'My Activities' : 'Imikorere Yanjye',
      icon: 'event',
      color: '#4A90E2',
      onPress: () => navigation.navigate('MyActivities'),
    },
    {
      id: 'payment-methods',
      title: language === 'en' ? 'Payment Methods' : 'Uburyo bwo Kwishyura',
      icon: 'payment',
      color: '#FF6B35',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 'safety-center',
      title: language === 'en' ? 'Safety Center' : 'Ikigo cy\'Umutekano',
      icon: 'security',
      color: '#9C27B0',
      onPress: () => navigation.navigate('SafetyCenter'),
    },
    {
      id: 'help-support',
      title: language === 'en' ? 'Help & Support' : 'Ubufasha n\'Inkunga',
      icon: 'help',
      color: '#FF9800',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 'about',
      title: language === 'en' ? 'About' : 'Ibyerekeye',
      icon: 'info',
      color: '#607D8B',
      onPress: () => navigation.navigate('About'),
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}>
      <View style={[styles.menuIcon, {backgroundColor: item.color + '20'}]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.menuText}>{item.title}</Text>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>12</Text>
        <Text style={styles.statLabel}>
          {language === 'en' ? 'Bookings' : 'Kwiyandikisha'}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>4.8</Text>
        <Text style={styles.statLabel}>
          {language === 'en' ? 'Rating' : 'Urwego'}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>3</Text>
        <Text style={styles.statLabel}>
          {language === 'en' ? 'Reviews' : 'Gusuzuma'}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: 'https://via.placeholder.com/100x100/2E7D32/FFFFFF?text=' + (user?.name?.[0] || 'U')}}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera-alt" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
          <View style={styles.userBadge}>
            <Icon name="verified" size={16} color="#fff" />
            <Text style={styles.badgeText}>
              {user?.role === 'host' 
                ? (language === 'en' ? 'Verified Host' : 'Umutwara Wemejwe')
                : (language === 'en' ? 'Verified Tourist' : 'Umukerarugendo Wemejwe')
              }
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats */}
      {renderStats()}

      {/* Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Settings' : 'Igenamiterere'}
        </Text>

        {/* Language Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="language" size={24} color="#2E7D32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                {language === 'en' ? 'Language' : 'Ururimi'}
              </Text>
              <Text style={styles.settingSubtitle}>
                {language === 'en' ? 'English' : 'Kinyarwanda'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLanguageChange}>
            <Text style={styles.changeText}>
              {language === 'en' ? 'Change' : 'Guhindura'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications" size={24} color="#FF6B35" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                {language === 'en' ? 'Notifications' : 'Amakuru'}
              </Text>
              <Text style={styles.settingSubtitle}>
                {language === 'en' ? 'Push notifications' : 'Amakuru yo mu telefone'}
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{false: '#E0E0E0', true: '#2E7D32'}}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Dark Mode Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="dark-mode" size={24} color="#9C27B0" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                {language === 'en' ? 'Dark Mode' : 'Uburyo bw\'umwijima'}
              </Text>
              <Text style={styles.settingSubtitle}>
                {language === 'en' ? 'Use dark theme' : 'Koresha isura y\'umwijima'}
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{false: '#E0E0E0', true: '#2E7D32'}}
            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Account' : 'Konti'}
        </Text>
        {menuItems.map(renderMenuItem)}
      </View>

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Admin' : 'Umuyobozi'}
          </Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminDashboard')}>
            <View style={[styles.menuIcon, {backgroundColor: '#FF5722' + '20'}]}>
              <Icon name="admin-panel-settings" size={24} color="#FF5722" />
            </View>
            <Text style={styles.menuText}>
              {language === 'en' ? 'Admin Dashboard' : 'Ikibaho cy\'umuyobozi'}
            </Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      )}

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#FF5722" />
          <Text style={styles.logoutText}>
            {language === 'en' ? 'Logout' : 'Sohoka'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          {language === 'en' ? 'Version 1.0.0' : 'Verisiyo 1.0.0'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2E7D32',
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#E8F5E8',
    marginBottom: 10,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  settingsSection: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  changeText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  menuSection: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutSection: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FF5722',
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfileScreen;