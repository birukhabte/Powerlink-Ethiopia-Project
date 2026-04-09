import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Search, Send, User, ChevronRight, MessageCircle } from 'lucide-react-native';

const MOCK_CONVERSATIONS = [
  { id: '1', name: 'Supervisor Yohannes', lastMsg: 'Please check the Bole transformer.', time: '10:30 AM', unread: 2, online: true },
  { id: '2', name: 'Admin Support', lastMsg: 'Your report was approved.', time: '09:15 AM', unread: 0, online: true },
  { id: '3', name: 'Tech Selam', lastMsg: 'I can help with the Kazanchis site.', time: 'Yesterday', unread: 0, online: false },
];

export default function TechChat() {
  const [chatSelected, setChatSelected] = useState<any>(null);
  const [msg, setMsg] = useState('');

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.convCard} onPress={() => setChatSelected(item)}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <User size={24} color="#6b7280" />
        </View>
        {item.online && <View style={styles.onlineBadge} />}
      </View>
      
      <View style={styles.convInfo}>
        <View style={styles.convHeader}>
          <Text style={styles.convName}>{item.name}</Text>
          <Text style={styles.convTime}>{item.time}</Text>
        </View>
        <View style={styles.convFooter}>
          <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMsg}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (chatSelected) {
    return (
      <View style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setChatSelected(null)}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatTitle}>{chatSelected.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.messageList}>
          <View style={styles.placeholderMsg}>
            <MessageCircle size={48} color="#d1d5db" />
            <Text style={styles.placeholderText}>Start of conversation with {chatSelected.name}</Text>
          </View>
        </View>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={msg}
            onChangeText={setMsg}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Send color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={20} color="#9ca3af" />
        <TextInput style={styles.searchInput} placeholder="Search contacts..." />
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
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
    backgroundColor: '#f3f4f6',
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  convInfo: {
    flex: 1,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  convName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  convTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  convFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMsg: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  messageList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  placeholderMsg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 16,
    fontSize: 14,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
