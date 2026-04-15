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
  Users,
  AlertCircle,
  HardHat,
  FileText,
  ChevronRight,
  Shield,
  Zap,
  Bell,
  Database,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getUser, User } from '../../hooks/useAuth';

export default function AdminDashboard() {
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

  const StatItem = ({ label, value, color, icon: Icon }: any) => (
    <View style={styles.statItem}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.shieldBox}>
            <Shield size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.welcomeText}>System Administrator</Text>
            <Text style={styles.userName}>{user?.first_name || 'Admin'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Global Overview</Text>
        <View style={styles.statsGrid}>
          <StatItem label="Total Users" value="1,248" color="#2563eb" icon={Users} />
          <StatItem label="Active Outages" value="4" color="#ef4444" icon={AlertCircle} />
          <StatItem label="Active Techs" value="18" color="#059669" icon={HardHat} />
          <StatItem label="Pending Req" value="42" color="#7c3aed" icon={FileText} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Controls</Text>
        <View style={styles.controlGrid}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => router.push('/(admin)/notices' as any)}>
            <Bell size={24} color="#f59e0b" />
            <Text style={styles.controlBtnText}>Broadcast Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Database size={24} color="#2563eb" />
            <Text style={styles.controlBtnText}>System Backup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => router.push('/(admin)/staff-register' as any)}>
            <Users size={24} color="#10b981" />
            <Text style={styles.controlBtnText}>Add Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => router.push('/(admin)/report' as any)}>
            <FileText size={24} color="#4f46e5" />
            <Text style={styles.controlBtnText}>Export Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusLive}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>API Server</Text>
            <Text style={styles.statusValueOnline}>ONLINE</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Database Cluster</Text>
            <Text style={styles.statusValueOnline}>HEALTHY</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>SMS Gateway</Text>
            <Text style={styles.statusValueOnline}>ACTIVE</Text>
          </View>
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
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shieldBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  statsCard: {
    marginHorizontal: 24,
    backgroundColor: '#1f2937',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  statItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '600',
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
  statusLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10b981',
  },
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  controlBtn: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  controlBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  statusBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusValueOnline: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
  },
});
