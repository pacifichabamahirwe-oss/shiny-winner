import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Title, Paragraph, Button, Chip, DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';

const {width} = Dimensions.get('window');

const AdminDashboardScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Mock data - in real app, this would come from API
    setStats({
      totalUsers: 1247,
      totalHosts: 156,
      totalActivities: 89,
      totalBookings: 2341,
      totalRevenue: 45678000,
      monthlyGrowth: 12.5,
      userGrowth: 8.3,
      revenueGrowth: 15.2,
    });

    setRecentActivities([
      {
        id: 1,
        title: 'Traditional Cooking Class',
        host: 'Marie Uwimana',
        status: 'active',
        bookings: 24,
        rating: 4.8,
        createdDate: '2024-01-20',
      },
      {
        id: 2,
        title: 'Imigongo Art Workshop',
        host: 'Jean Baptiste',
        status: 'pending',
        bookings: 0,
        rating: 0,
        createdDate: '2024-01-25',
      },
      {
        id: 3,
        title: 'Village Tour & Storytelling',
        host: 'Grace Mukamana',
        status: 'active',
        bookings: 32,
        rating: 4.7,
        createdDate: '2024-01-18',
      },
    ]);

    setPendingVerifications([
      {
        id: 1,
        name: 'Paul Nkurunziza',
        email: 'paul@example.com',
        submittedDate: '2024-01-24',
        documents: ['ID', 'Address Proof'],
      },
      {
        id: 2,
        name: 'Francine Mukamana',
        email: 'francine@example.com',
        submittedDate: '2024-01-23',
        documents: ['ID', 'Address Proof', 'Business License'],
      },
    ]);

    setDisputes([
      {
        id: 1,
        type: 'Payment',
        user: 'Sarah Johnson',
        host: 'Marie Uwimana',
        amount: 30000,
        status: 'open',
        createdDate: '2024-01-25',
      },
      {
        id: 2,
        type: 'Cancellation',
        user: 'Michael Chen',
        host: 'Jean Baptiste',
        amount: 20000,
        status: 'resolved',
        createdDate: '2024-01-22',
      },
    ]);
  };

  const formatCurrency = (amount) => {
    return `RWF ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'suspended':
        return colors.error;
      case 'resolved':
        return colors.success;
      case 'open':
        return colors.warning;
      default:
        return colors.gray;
    }
  };

  const renderStatCard = (title, value, icon, growth, color = colors.primary) => (
    <Card style={styles.statCard}>
      <Card.Content>
        <View style={styles.statHeader}>
          <Icon name={icon} size={24} color={color} />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        {growth && (
          <View style={styles.growthContainer}>
            <Icon name="trending-up" size={16} color={colors.success} />
            <Text style={styles.growthText}>+{growth}%</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderActivityRow = (activity) => (
    <DataTable.Row key={activity.id}>
      <DataTable.Cell>{activity.title}</DataTable.Cell>
      <DataTable.Cell>{activity.host}</DataTable.Cell>
      <DataTable.Cell>
        <Chip
          style={[styles.statusChip, {backgroundColor: getStatusColor(activity.status) + '20'}]}
          textStyle={{color: getStatusColor(activity.status)}}>
          {activity.status}
        </Chip>
      </DataTable.Cell>
      <DataTable.Cell numeric>{activity.bookings}</DataTable.Cell>
      <DataTable.Cell numeric>{activity.rating || '-'}</DataTable.Cell>
    </DataTable.Row>
  );

  const renderVerificationRow = (verification) => (
    <DataTable.Row key={verification.id}>
      <DataTable.Cell>{verification.name}</DataTable.Cell>
      <DataTable.Cell>{verification.email}</DataTable.Cell>
      <DataTable.Cell>{verification.documents.join(', ')}</DataTable.Cell>
      <DataTable.Cell>{formatDate(verification.submittedDate)}</DataTable.Cell>
      <DataTable.Cell>
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            compact
            style={styles.approveButton}
            onPress={() => handleApproveVerification(verification.id)}>
            Approve
          </Button>
          <Button
            mode="outlined"
            compact
            style={styles.rejectButton}
            onPress={() => handleRejectVerification(verification.id)}>
            Reject
          </Button>
        </View>
      </DataTable.Cell>
    </DataTable.Row>
  );

  const renderDisputeRow = (dispute) => (
    <DataTable.Row key={dispute.id}>
      <DataTable.Cell>{dispute.type}</DataTable.Cell>
      <DataTable.Cell>{dispute.user}</DataTable.Cell>
      <DataTable.Cell>{dispute.host}</DataTable.Cell>
      <DataTable.Cell numeric>{formatCurrency(dispute.amount)}</DataTable.Cell>
      <DataTable.Cell>
        <Chip
          style={[styles.statusChip, {backgroundColor: getStatusColor(dispute.status) + '20'}]}
          textStyle={{color: getStatusColor(dispute.status)}}>
          {dispute.status}
        </Chip>
      </DataTable.Cell>
    </DataTable.Row>
  );

  const handleApproveVerification = (id) => {
    // Handle verification approval
    console.log('Approve verification:', id);
  };

  const handleRejectVerification = (id) => {
    // Handle verification rejection
    console.log('Reject verification:', id);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Users', stats.totalUsers?.toLocaleString(), 'people', stats.userGrowth)}
          {renderStatCard('Total Hosts', stats.totalHosts?.toLocaleString(), 'home', stats.monthlyGrowth)}
          {renderStatCard('Activities', stats.totalActivities?.toLocaleString(), 'event', null)}
          {renderStatCard('Bookings', stats.totalBookings?.toLocaleString(), 'book-online', null)}
          {renderStatCard('Revenue', formatCurrency(stats.totalRevenue), 'attach-money', stats.revenueGrowth, colors.success)}
        </View>
      </View>

      {/* Recent Activities */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Activities</Title>
            <Button mode="outlined" compact onPress={() => navigation.navigate('ActivitiesManagement')}>
              View All
            </Button>
          </View>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Activity</DataTable.Title>
              <DataTable.Title>Host</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title numeric>Bookings</DataTable.Title>
              <DataTable.Title numeric>Rating</DataTable.Title>
            </DataTable.Header>
            {recentActivities.map(renderActivityRow)}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Pending Verifications */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Pending Verifications</Title>
            <Button mode="outlined" compact onPress={() => navigation.navigate('VerificationsManagement')}>
              View All
            </Button>
          </View>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Documents</DataTable.Title>
              <DataTable.Title>Submitted</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            {pendingVerifications.map(renderVerificationRow)}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Disputes */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Disputes</Title>
            <Button mode="outlined" compact onPress={() => navigation.navigate('DisputesManagement')}>
              View All
            </Button>
          </View>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Type</DataTable.Title>
              <DataTable.Title>User</DataTable.Title>
              <DataTable.Title>Host</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>
            {disputes.map(renderDisputeRow)}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('UsersManagement')}>
              <Icon name="people" size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Manage Users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ActivitiesManagement')}>
              <Icon name="event" size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Manage Activities</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AnalyticsScreen')}>
              <Icon name="analytics" size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ReportsScreen')}>
              <Icon name="assessment" size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
  },
  headerSubtitle: {
    ...typography.body1,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  statsContainer: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - spacing.lg * 3) / 2,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statTitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  statValue: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    ...typography.caption,
    color: colors.success,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    margin: spacing.lg,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusChip: {
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  approveButton: {
    borderRadius: 4,
  },
  rejectButton: {
    borderRadius: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - spacing.lg * 3) / 2,
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  quickActionText: {
    ...typography.body2,
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default AdminDashboardScreen;