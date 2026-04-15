import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  FileCheck,
  ClipboardList,
  Users,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getUser, User } from '../../hooks/useAuth';

export default function SupervisorDashboard() {
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
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <Icon size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello Supervisor,</Text>
        <Text style={styles.userName}>{user?.first_name || 'Officer'}</Text>
        <Text style={styles.subtext}>Field overview at a glance.</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Docs to Validate" value="8" icon={FileCheck} color="#2563eb" bg="#eff6ff" />
        <StatCard title="Open Requests" value="14" icon={ClipboardList} color="#7c3aed" bg="#f5f3ff" />
        <StatCard title="Active Techs" value="6" icon={Users} color="#059669" bg="#ecfdf5" />
        <StatCard title="High Priority" value="3" icon={AlertTriangle} color="#ef4444" bg="#fef2f2" />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Priority Queue</Text>
          <TouchableOpacity onPress={() => router.push('/(supervisor)/requests' as any)}>
            <Text style={styles.viewAll}>Manage All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.priorityCard}
          onPress={() => router.push('/(supervisor)/requests' as any)}
        >
          <View style={styles.cardIndicator} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>New Service Connection</Text>
            <Text style={styles.cardSub}>Requested by: Abebe Bikila</Text>
            <View style={styles.cardMeta}>
              <Clock size={12} color="#6b7280" />
              <Text style={styles.metaText}>Wait: 2.5 hours</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <TrendingUp size={24} color="#2563eb" />
          <Text style={styles.insightText}>
            Average response time is down <Text style={{ fontWeight: 'bold' }}>12%</Text> this week.
          </Text>
        </View>
      </View>

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
  subtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: (400 - 20 * 2 - 12) / 2, // 400 is a baseline width, using fixed padding and gap
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
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
  },
  viewAll: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  priorityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 2,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardSub: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
  },
});
