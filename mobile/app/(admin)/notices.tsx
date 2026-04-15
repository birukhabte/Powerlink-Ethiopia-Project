import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Bell, AlertTriangle, Info, Plus, Trash2, ChevronRight } from 'lucide-react-native';

const MOCK_NOTICES = [
  { id: '1', title: 'Planned Maintenance', type: 'warning', message: 'Power will be interrupted in Bole area on Sunday.', date: '2026-04-10' },
  { id: '2', title: 'New Feature', type: 'info', message: 'You can now view your billing history on the app.', date: '2026-04-08' },
  { id: '3', title: 'System Update', type: 'success', message: 'The backend has been upgraded for better performance.', date: '2026-04-05' },
];

export default function Notices() {
  const [notices, setNotices] = useState(MOCK_NOTICES);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Notice', 'Are you sure you want to remove this notice?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setNotices(notices.filter(n => n.id !== id));
      }},
    ]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={20} color="#f59e0b" />;
      case 'info': return <Info size={20} color="#2563eb" />;
      case 'success': return <Info size={20} color="#10b981" />;
      default: return <Bell size={20} color="#6b7280" />;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardHeader}>
          {getIcon(item.type)}
          <Text style={styles.noticeTitle}>{item.title}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.noticeMsg}>{item.message}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{item.date}</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>System Notices</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Plus size={16} color="#fff" />
              <Text style={styles.addBtnText}>New Notice</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  noticeMsg: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  editBtn: {
    padding: 4,
  },
});
