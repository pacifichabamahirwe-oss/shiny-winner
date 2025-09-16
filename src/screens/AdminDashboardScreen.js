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
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const AdminDashboardScreen = ({navigation}) => {
  const {t, language} = useLanguage();
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Mock data - replace with actual API calls
    const mockStats = {
      totalUsers: 1250,
      totalHosts: 150,
      totalActivities: 500,
      totalBookings: 1200,
      totalRevenue: 15000000,
      monthlyGrowth: 15.5,
    };

    const mockRecentActivities = [
      {
        id: '1',
        title: 'Traditional Rwandan Cooking Class',
        host: 'Mukamana Grace',
        status: 'active',
        bookings: 45,
        rating: 4.8,
        createdAt: '2024-01-10',
      },
      {
        id: '2',
        title: 'Imigongo Art Workshop',
        host: 'Nkurunziza Jean',
        status: 'pending',
        bookings: 0,
        rating: 0,
        createdAt: '2024-01-12',
      },
      {
        id: '3',
        title: 'Village Life Experience',
        host: 'Uwimana Marie',
        status: 'active',
        bookings: 28,
        rating: 4.7,
        createdAt: '2024-01-08',
      },
    ];

    const mockPendingApprovals = [
      {
        id: '1',
        type: 'host',
        name: 'Kamali John',
        email: 'kamali@example.com',
        submittedAt: '2024-01-14',
        status: 'pending',
      },
      {
        id: '2',
        type: 'activity',
        title: 'Traditional Dance Performance',
        host: 'Mukamana Jean Paul',
        submittedAt: '2024-01-13',
        status: 'pending',
      },
    ];

    setStats(mockStats);
    setRecentActivities(mockRecentActivities);
    setPendingApprovals(mockPendingApprovals);
  };

  const handleApprove = (id, type) => {
    Alert.alert(
      'Approve',
      `Are you sure you want to approve this ${type}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Approve',
          onPress: () => {
            if (type === 'host') {
              setPendingApprovals(prev => prev.filter(item => item.id !== id));
            } else {
              setPendingApprovals(prev => prev.filter(item => item.id !== id));
              setRecentActivities(prev => 
                prev.map(activity => 
                  activity.id === id 
                    ? {...activity, status: 'active'}
                    : activity
                )
              );
            }
          }
        }
      ]
    );
  };

  const handleReject = (id, type) => {
    Alert.alert(
      'Reject',
      `Are you sure you want to reject this ${type}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            if (type === 'host') {
              setPendingApprovals(prev => prev.filter(item => item.id !== id));
            } else {
              setPendingApprovals(prev => prev.filter(item => item.id !== id));
            }
          }
        }
      ]
    );
  };

  const renderStatCard = (title, value, icon, color, subtitle) => (
    <View key={title} style={styles.statCard}>
      <LinearGradient
        colors={[color, color + '80']}
        style={styles.statGradient}>
        <Icon name={icon} size={24} color="#fff" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    </View>
  );

  const renderActivityCard = (activity) => (
    <View key={activity.id} style={styles.activityCard}>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityHost}>by {activity.host}</Text>
        <View style={styles.activityMeta}>
          <View style={styles.metaItem}>
            <Icon name="event" size={14} color="#666" />
            <Text style={styles.metaText}>{activity.bookings} bookings</Text>
          </View>
          {activity.rating > 0 && (
            <View style={styles.metaItem}>
              <Icon name="star" size={14} color="#FFD700" />
              <Text style={styles.metaText}>{activity.rating}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.activityActions}>
        <View style={[
          styles.statusBadge,
          {backgroundColor: activity.status === 'active' ? '#E8F5E8' : '#FFF3E0'}
        ]}>
          <Text style={[
            styles.statusText,
            {color: activity.status === 'active' ? '#2E7D32' : '#FF9800'}
          ]}>
            {activity.status}
          </Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="more-vert" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderApprovalCard = (item) => (
    <View key={item.id} style={styles.approvalCard}>
      <View style={styles.approvalInfo}>
        <Text style={styles.approvalTitle}>
          {item.type === 'host' ? item.name : item.title}
        </Text>
        {item.type === 'activity' && (
          <Text style={styles.approvalSubtitle}>by {item.host}</Text>
        )}
        <Text style={styles.approvalDate}>
          Submitted: {new Date(item.submittedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.approvalActions}>
        <TouchableOpacity
          style={[styles.approvalButton, styles.approveButton]}
          onPress={() => handleApprove(item.id, item.type)}>
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.approvalButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.approvalButton, styles.rejectButton]}
          onPress={() => handleReject(item.id, item.type)}>
          <Icon name="close" size={16} color="#fff" />
          <Text style={styles.approvalButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}>
        <Text style={styles.headerTitle}>
          {language === 'en' ? 'Admin Dashboard' : 'Ikibaho cy\'Umuyobozi'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {language === 'en' ? 'Manage your platform' : 'Gucunga urubuga rwawe'}
        </Text>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {renderStatCard(
          language === 'en' ? 'Total Users' : 'Abakoresha Bose',
          stats.totalUsers?.toLocaleString() || '0',
          'people',
          '#2E7D32'
        )}
        {renderStatCard(
          language === 'en' ? 'Active Hosts' : 'Abatwara Bikora',
          stats.totalHosts?.toLocaleString() || '0',
          'home',
          '#4A90E2'
        )}
        {renderStatCard(
          language === 'en' ? 'Activities' : 'Imikorere',
          stats.totalActivities?.toLocaleString() || '0',
          'event',
          '#FF6B35'
        )}
        {renderStatCard(
          language === 'en' ? 'Total Bookings' : 'Kwiyandikisha Byose',
          stats.totalBookings?.toLocaleString() || '0',
          'book-online',
          '#9C27B0'
        )}
        {renderStatCard(
          language === 'en' ? 'Revenue' : 'Amafaranga',
          `RWF ${stats.totalRevenue?.toLocaleString() || '0'}`,
          'attach-money',
          '#FF9800'
        )}
        {renderStatCard(
          language === 'en' ? 'Growth' : 'Kwiyongera',
          `${stats.monthlyGrowth || '0'}%`,
          'trending-up',
          '#4CAF50',
          language === 'en' ? 'This month' : 'Uku kwezi'
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Quick Actions' : 'Imikorere Vuba'}
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="people" size={24} color="#2E7D32" />
            <Text style={styles.quickActionText}>
              {language === 'en' ? 'Manage Users' : 'Gucunga Abakoresha'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="event" size={24} color="#4A90E2" />
            <Text style={styles.quickActionText}>
              {language === 'en' ? 'Manage Activities' : 'Gucunga Imikorere'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="payment" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>
              {language === 'en' ? 'View Payments' : 'Reba Amashyura'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="analytics" size={24} color="#9C27B0" />
            <Text style={styles.quickActionText}>
              {language === 'en' ? 'Analytics' : 'Gusuzuma'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Pending Approvals' : 'Byitegereje Kwemeza'}
          </Text>
          {pendingApprovals.map(renderApprovalCard)}
        </View>
      )}

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Recent Activities' : 'Imikorere ya Vuba'}
        </Text>
        {recentActivities.map(renderActivityCard)}
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
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F5E8',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#E8F5E8',
    marginTop: 2,
  },
  section: {
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginBottom: 10,
  },
  quickActionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  approvalCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  approvalInfo: {
    marginBottom: 15,
  },
  approvalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  approvalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  approvalDate: {
    fontSize: 12,
    color: '#999',
  },
  approvalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approvalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#2E7D32',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  approvalButtonText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  activityHost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  activityActions: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    padding: 5,
  },
});

export default AdminDashboardScreen;