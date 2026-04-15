import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Users, Search, Filter, UserPlus, ChevronRight, User } from 'lucide-react-native';

const MOCK_USERS = [
  { id: '1', name: 'Yilkal G.', role: 'Admin', email: 'admin@powerlink.com' },
  { id: '2', name: 'Yohannes T.', role: 'Supervisor', email: 'sup@powerlink.com' },
  { id: '3', name: 'Selam A.', role: 'Technician', email: 'tech@powerlink.com' },
  { id: '4', name: 'Dawit L.', role: 'Customer', email: 'cust@gmail.com' },
];

export default function ManageAccounts() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.avatar}>
        <User size={20} color="#6b7280" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.roleBox}>
        <Text style={styles.roleText}>{item.role}</Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email or BP..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_USERS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.resultCount}>Showing {MOCK_USERS.length} accounts</Text>
            <TouchableOpacity 
              style={styles.addBtn}
              onPress={() => {}}
            >
              <UserPlus size={16} color="#fff" />
              <Text style={styles.addBtnText}>Add Staff</Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  filterBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
  },
  listContent: {
    padding: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  email: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  roleBox: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4b5563',
  },
});
