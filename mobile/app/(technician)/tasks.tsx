import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ClipboardList, MapPin, Clock, ChevronRight, AlertCircle, Filter } from 'lucide-react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../hooks/useAuth';

export default function TechTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const headers = await getAuthHeaders();
      // On the web, technician dashboard data includes assigned tasks
      const response = await axios.get(API_ENDPOINTS.dashboard.technician, { headers });
      setTasks(response.data.assignedTasks || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      // Fallback/Mock data for UI development if API fails
      setTasks([
        { id: '1', type: 'new_service', status: 'pending', priority: 'high', address: 'Bole, Addis Ababa', landmark: 'Near Edna Mall', createdAt: new Date().toISOString() },
        { id: '2', type: 'relocation', status: 'in_progress', priority: 'medium', address: 'Kazanchis', landmark: 'Opposite Hilton', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return { bg: '#fee2e2', text: '#b91c1c' };
      case 'medium': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#dcfce7', text: '#166534' };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const priority = getPriorityStyle(item.priority || 'low');
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
            <Text style={[styles.priorityText, { color: priority.text }]}>
              {item.priority?.toUpperCase()} PRIORITY
            </Text>
          </View>
          <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
        </View>

        <Text style={styles.taskTitle}>{item.type.replace('_', ' ').toUpperCase()}</Text>
        
        <View style={styles.infoRow}>
          <MapPin size={14} color="#6b7280" />
          <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={14} color="#6b7280" />
          <Text style={styles.infoText}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.viewDetails}>View Details & Update</Text>
          <ChevronRight size={18} color="#2563eb" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <Text style={styles.resultsText}>{tasks.length} tasks found</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={16} color="#4b5563" />
          <Text style={styles.filterBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ClipboardList size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No Tasks Assigned</Text>
              <Text style={styles.emptySubtitle}>You're all caught up! New tasks will appear here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterBtnText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  viewDetails: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});
