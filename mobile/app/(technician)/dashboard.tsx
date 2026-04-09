import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Switch,
} from 'react-native';
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  User,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getUser, User as UserType } from '../../hooks/useAuth';

export default function TechDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Expert Mode,</Text>
            <Text style={styles.userName}>{user?.first_name || 'Technician'}</Text>
          </View>
          <View style={styles.statusToggle}>
            <Text style={[styles.statusLabel, { color: isOnline ? '#10b981' : '#6b7280' }]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderLeftColor: '#2563eb' }]}>
          <Text style={styles.statNum}>12</Text>
          <Text style={styles.statLabelSmall}>Total Tasks</Text>
        </View>
        <View style={[styles.statBox, { borderLeftColor: '#f59e0b' }]}>
          <Text style={styles.statNum}>3</Text>
          <Text style={styles.statLabelSmall}>Pending</Text>
        </View>
        <View style={[styles.statBox, { borderLeftColor: '#10b981' }]}>
          <Text style={styles.statNum}>9</Text>
          <Text style={styles.statLabelSmall}>Resolved</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Assignment</Text>
        <TouchableOpacity 
          style={styles.activeTaskCard}
          onPress={() => router.push('/(technician)/tasks' as any)}
        >
          <View style={styles.taskHeader}>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>HIGH PRIORITY</Text>
            </View>
            <Text style={styles.taskId}>#TASK-8821</Text>
          </View>
          <Text style={styles.taskType}>Transformer Maintenance</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.locationText}>Bole Road, Near Friendship Mall</Text>
          </View>
          <View style={styles.taskFooter}>
            <Text style={styles.timeText}>Scheduled: 10:30 AM</Text>
            <View style={styles.viewDetailsBtn}>
              <Text style={styles.viewDetailsText}>Update Status</Text>
              <ChevronRight size={16} color="#2563eb" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety First</Text>
        <View style={styles.safetyCard}>
          <ShieldCheck color="#10b981" size={32} />
          <View style={styles.safetyInfo}>
            <Text style={styles.safetyTitle}>Safety Checklist Pending</Text>
            <Text style={styles.safetyDesc}>Ensure you have all PPE before starting work.</Text>
            <TouchableOpacity style={styles.checklistBtn}>
              <Text style={styles.checklistBtnText}>Complete Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/(technician)/map' as any)}>
          <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
            <MapPin color="#2563eb" size={24} />
          </View>
          <Text style={styles.gridLabel}>Service Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/(technician)/chat' as any)}>
          <View style={[styles.iconCircle, { backgroundColor: '#f5f3ff' }]}>
            <MessageSquare color="#7c3aed" size={24} />
          </View>
          <Text style={styles.gridLabel}>Team Chat</Text>
        </TouchableOpacity>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusToggle: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  statNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabelSmall: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  activeTaskCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  taskId: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  taskType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 14,
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
    alignItems: 'center',
    gap: 16,
  },
  safetyInfo: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
  },
  safetyDesc: {
    fontSize: 12,
    color: '#065f46',
    opacity: 0.8,
    marginTop: 2,
  },
  checklistBtn: {
    marginTop: 12,
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  checklistBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  gridBtn: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
});
