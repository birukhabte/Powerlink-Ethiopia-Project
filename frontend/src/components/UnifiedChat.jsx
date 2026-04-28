/**
 * UnifiedChat.jsx
 * Fully functional real-time chat component for Admin, Supervisor, and Technician roles.
 * Uses Socket.IO for real-time messaging + REST API for persistence.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  MessageSquare, Send, Search, Check, CheckCheck,
  Users, Plus, X, Loader, Wifi, WifiOff, ChevronLeft
} from 'lucide-react';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

const getRoleColor = (role) => {
  const colors = {
    admin:      'bg-purple-100 text-purple-700',
    supervisor: 'bg-blue-100 text-blue-700',
    technician: 'bg-green-100 text-green-700',
    customer:   'bg-gray-100 text-gray-600',
  };
  return colors[role] || 'bg-gray-100 text-gray-600';
};

const getRoleBadge = (role) => {
  const labels = {
    admin:      'Admin',
    supervisor: 'Supervisor',
    technician: 'Tech',
    customer:   'Customer',
  };
  return labels[role] || role;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const UnifiedChat = () => {
  const [contacts, setContacts] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [staffSearch, setStaffSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ─── Socket.IO Setup ──────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('user_joined', currentUser.id);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('receive_message', (message) => {
      setMessages(prev => {
        // Avoid duplicates (message was already added optimistically)
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      // Update contact's last message
      setContacts(prev => prev.map(c => {
        if (c.id === message.sender_id) {
          return { ...c, lastMessage: message.content, lastMessageTime: message.created_at, unreadCount: (c.unreadCount || 0) + 1 };
        }
        return c;
      }));
    });

    socket.on('online_users', (userIds) => setOnlineUsers(userIds.map(String)));

    return () => socket.disconnect();
  }, [currentUser.id]);

  // ─── Fetch contacts ───────────────────────────────────────────────────────
  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.messages.contacts, authHeaders);
      if (res.data.success) setContacts(res.data.contacts);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.messages.staff, authHeaders);
      if (res.data.success) setAllStaff(res.data.staff);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchStaff();
  }, []);

  // ─── Scroll to bottom ─────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Select a contact ────────────────────────────────────────────────────
  const selectContact = async (contact) => {
    setActiveContact(contact);
    setShowMobileChat(true);
    setMsgLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.messages.conversation(contact.id), authHeaders);
      if (res.data.success) setMessages(res.data.messages);
      // Reset unread count
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unreadCount: 0 } : c));
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setMsgLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // ─── Start new chat ──────────────────────────────────────────────────────
  const startNewChat = (staffMember) => {
    // Add to contacts if not already there
    setContacts(prev => {
      if (prev.some(c => c.id === staffMember.id)) return prev;
      return [{ ...staffMember, lastMessage: '', lastMessageTime: null, unreadCount: 0 }, ...prev];
    });
    setShowNewChat(false);
    setStaffSearch('');
    selectContact(staffMember);
  };

  // ─── Send message ─────────────────────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic UI — add immediately
    const optimistic = {
      id: `temp-${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: activeContact.id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: currentUser,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await axios.post(API_ENDPOINTS.messages.base, {
        receiver_id: activeContact.id,
        content,
      }, authHeaders);

      if (res.data.success) {
        // Replace optimistic with real message
        setMessages(prev => prev.map(m => m.id === optimistic.id ? res.data.message : m));
        // Update contact's last message
        setContacts(prev => {
          const updated = prev.map(c =>
            c.id === activeContact.id ? { ...c, lastMessage: content, lastMessageTime: new Date().toISOString() } : c
          );
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic on failure
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setNewMessage(content); // Restore input
    } finally {
      setSending(false);
    }
  };

  // ─── Filtered lists ───────────────────────────────────────────────────────
  const filteredContacts = contacts.filter(c => {
    const name = `${c.first_name || ''} ${c.last_name || ''} ${c.username || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const filteredStaff = allStaff.filter(s => {
    const name = `${s.first_name || ''} ${s.last_name || ''} ${s.username || ''} ${s.role || ''}`.toLowerCase();
    return name.includes(staffSearch.toLowerCase()) && !contacts.some(c => c.id === s.id);
  });

  const isOnline = (userId) => onlineUsers.includes(String(userId));

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

      {/* ── Sidebar (Contact List) ── */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-100 bg-gray-50/40`}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600" />
              Messages
            </h2>
            <div className="flex items-center gap-2">
              {/* Connection status */}
              <span title={connected ? 'Connected' : 'Disconnected'}>
                {connected
                  ? <Wifi size={16} className="text-green-500" />
                  : <WifiOff size={16} className="text-red-400" />}
              </span>
              {/* New chat button */}
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="New conversation"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Search contacts */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* New chat panel */}
        {showNewChat && (
          <div className="border-b border-gray-100 bg-blue-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-blue-800">Start new conversation</span>
              <button onClick={() => setShowNewChat(false)}><X size={14} className="text-gray-400" /></button>
            </div>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={staffSearch}
                onChange={e => setStaffSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredStaff.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-2">No staff found</p>
              ) : filteredStaff.map(s => (
                <button
                  key={s.id}
                  onClick={() => startNewChat(s)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {(s.first_name?.[0] || s.username?.[0] || '?').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.first_name} {s.last_name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getRoleColor(s.role)}`}>{getRoleBadge(s.role)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader size={24} className="animate-spin text-blue-600" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <Users size={28} className="text-blue-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Click + to start a new chat</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => selectContact(contact)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-all border-l-4 hover:bg-white ${
                  activeContact?.id === contact.id
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {(contact.first_name?.[0] || contact.username?.[0] || '?').toUpperCase()}
                  </div>
                  {isOnline(contact.id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {contact.first_name} {contact.last_name}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                      {formatTime(contact.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate w-3/4">{contact.lastMessage || 'No messages yet'}</p>
                    {contact.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 flex-shrink-0">
                        {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block ${getRoleColor(contact.role)}`}>
                    {getRoleBadge(contact.role)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat Board ── */}
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white`}>
        {activeContact ? (
          <>
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white shadow-sm">
              {/* Mobile back */}
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>

              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {(activeContact.first_name?.[0] || activeContact.username?.[0] || '?').toUpperCase()}
                </div>
                {isOnline(activeContact.id) && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">
                  {activeContact.first_name} {activeContact.last_name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getRoleColor(activeContact.role)}`}>
                    {getRoleBadge(activeContact.role)}
                  </span>
                  <span className={`text-[10px] font-medium ${isOnline(activeContact.id) ? 'text-green-600' : 'text-gray-400'}`}>
                    {isOnline(activeContact.id) ? '● Online' : '● Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gradient-to-b from-gray-50/30 to-white">
              {msgLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader size={28} className="animate-spin text-blue-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <MessageSquare size={28} className="text-blue-300" />
                  </div>
                  <p className="text-sm text-gray-500">No messages yet — say hello! 👋</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.sender_id === currentUser.id;
                  return (
                    <div key={msg.id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      {!isMine && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center text-xs font-bold mr-2 mt-auto flex-shrink-0">
                          {(activeContact.first_name?.[0] || '?').toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`max-w-[72%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}
                      >
                        <p className="leading-relaxed break-words">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${isMine ? 'text-blue-100 justify-end' : 'text-gray-400'}`}>
                          {formatTime(msg.created_at)}
                          {isMine && (
                            msg.is_read
                              ? <CheckCheck size={11} className="text-blue-200" />
                              : <Check size={11} className="text-blue-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  disabled={sending}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none disabled:opacity-60"
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(e); }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                >
                  {sending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gray-50/20">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <MessageSquare size={44} className="text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">PowerLink Connect</h2>
            <p className="text-gray-500 max-w-xs">Select a conversation from the sidebar, or click <strong>+</strong> to start a new one.</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              {connected
                ? <><Wifi size={14} className="text-green-500" /> Real-time messaging active</>
                : <><WifiOff size={14} className="text-red-400" /> Connecting...</>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedChat;
