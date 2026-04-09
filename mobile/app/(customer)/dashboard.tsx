import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Zap,
  Ticket,
  Map as MapIcon,
  MessageSquare,
  Clock,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getUser, User } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

export default function CustDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadUser();
    // Fetch dashboard data here once API is ready
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.first_name || 'Customer'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
          <Zap size={24} color="#2563eb" />
          <Text style={styles.statValue}>Active</Text>
          <Text style={styles.statLabel}>Power Status</Text>
        </View>
        <TouchableOpacity 
          style={[styles.statCard, { backgroundColor: '#fdf2f8' }]}
          onPress={() => router.push('/(customer)/ticket' as any)}
        >
          <Ticket size={24} color="#db2777" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Open Tickets</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/(customer)/ticket' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fee2e2' }]}>
              <AlertTriangle size={24} color="#ef4444" />
            </View>
            <Text style={styles.actionLabel}>Report Outage</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <MapIcon size={24} color="#f59e0b" />
            </View>
            <Text style={styles.actionLabel}>Outage Map</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/(customer)/request-service' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Zap size={24} color="#10b981" />
            </View>
            <Text style={styles.actionLabel}>Request Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#e0e7ff' }]}>
              <MessageSquare size={24} color="#4f46e5" />
            </View>
            <Text style={styles.actionLabel}>Support Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity onPress={() => router.push('/(customer)/history' as any)}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityList}>
          <View style={styles.emptyState}>
            <Clock size={40} color="#d1d5db" />
            <Text style={styles.emptyText}>No recent activities found.</Text>
          </View>
        </View>
      </View>

      {/* Spacing for bottom */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  viewAll: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: (width - 48 - 12) / 2,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  activityList: {
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 14,
  },
});
