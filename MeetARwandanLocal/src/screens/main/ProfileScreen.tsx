import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SIZES } from '../../constants';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const ProfileItem = ({ icon, title, onPress, showArrow = true }: any) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
        <Text style={styles.profileItemTitle}>{title}</Text>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : require('../../../assets/icon.png')
            }
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={16} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userType}>
          {user?.userType === 'tourist' ? '🧳 Tourist' : '🏠 Local Host'}
        </Text>
        
        {user?.userType === 'local' && (
          <View style={styles.verificationBadge}>
            <Ionicons
              name={user.verificationStatus === 'verified' ? 'checkmark-circle' : 'time'}
              size={16}
              color={user.verificationStatus === 'verified' ? COLORS.success : COLORS.warning}
            />
            <Text style={[
              styles.verificationText,
              { color: user.verificationStatus === 'verified' ? COLORS.success : COLORS.warning }
            ]}>
              {user.verificationStatus === 'verified' ? 'Verified Host' : 'Verification Pending'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Menu */}
      <View style={styles.menu}>
        <Text style={styles.menuSection}>Account</Text>
        
        <ProfileItem
          icon="person-outline"
          title="Personal Information"
          onPress={() => navigation.navigate('EditProfile')}
        />
        
        <ProfileItem
          icon="notifications-outline"
          title="Notifications"
          onPress={() => {}}
        />
        
        <ProfileItem
          icon="language-outline"
          title="Language & Region"
          onPress={() => {}}
        />

        {user?.userType === 'local' && (
          <>
            <Text style={styles.menuSection}>Host Tools</Text>
            
            <ProfileItem
              icon="add-circle-outline"
              title="Create Experience"
              onPress={() => navigation.navigate('CreateActivity')}
            />
            
            <ProfileItem
              icon="list-outline"
              title="My Experiences"
              onPress={() => {}}
            />
            
            <ProfileItem
              icon="shield-checkmark-outline"
              title="Verification"
              onPress={() => {}}
            />
          </>
        )}

        <Text style={styles.menuSection}>Support</Text>
        
        <ProfileItem
          icon="help-circle-outline"
          title="Help Center"
          onPress={() => {}}
        />
        
        <ProfileItem
          icon="document-text-outline"
          title="Terms & Privacy"
          onPress={() => {}}
        />
        
        <ProfileItem
          icon="chatbubble-ellipses-outline"
          title="Contact Us"
          onPress={() => {}}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: SIZES.padding,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.border,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: SIZES.title2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userType: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationText: {
    fontSize: SIZES.footnote,
    marginLeft: 4,
    fontWeight: '600',
  },
  editProfileButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  editProfileText: {
    color: COLORS.surface,
    fontSize: SIZES.subhead,
    fontWeight: '600',
  },
  menu: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
  },
  menuSection: {
    fontSize: SIZES.subhead,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemTitle: {
    fontSize: SIZES.body,
    color: COLORS.text,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: SIZES.body,
    color: COLORS.error,
    marginLeft: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;