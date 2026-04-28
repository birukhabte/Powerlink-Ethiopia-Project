/**
 * NotificationBell.jsx
 * Real-time notification bell with dropdown panel.
 * Subscribes to Socket.IO for live updates and fetches from REST API.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Bell, Check, CheckCheck, Trash2, X, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

const getIcon = (type) => {
  const cls = 'flex-shrink-0';
  switch (type) {
    case 'alert':   return <AlertCircle  size={16} className={`${cls} text-red-500`} />;
    case 'success': return <CheckCircle2 size={16} className={`${cls} text-green-500`} />;
    default:        return <Info         size={16} className={`${cls} text-blue-500`} />;
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  if (diff < 60000)    return 'Just now';
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // ── Fetch notifications ───────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.notifications.base, authHeaders);
      if (res.data.success) {
        setNotifications(res.data.notifications.slice(0, 20)); // Cap at 20 in dropdown
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Socket.IO for real-time notifications ─────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) return;

    fetchNotifications();

    const socket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('user_joined', currentUser.id);
    });

    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev.slice(0, 19)]);
      // Brief shake animation via class toggle — done via state
    });

    return () => socket.disconnect();
  }, [currentUser?.id]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      await axios.patch(API_ENDPOINTS.notifications.markRead(id), {}, authHeaders);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(API_ENDPOINTS.notifications.markAll, {}, authHeaders);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(API_ENDPOINTS.notifications.delete(id), authHeaders);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className={unreadCount > 0 ? 'text-blue-600' : 'text-gray-500'} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-blue-600" />
              <span className="font-bold text-gray-800 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <CheckCheck size={11} /> All read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell size={32} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400 font-medium">All caught up!</p>
                <p className="text-xs text-gray-300">No new notifications</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  className={`group flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                    notif.is_read ? 'hover:bg-gray-50' : 'bg-blue-50/40 hover:bg-blue-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mt-0.5 flex-shrink-0 ${notif.is_read ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${notif.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(notif.created_at)}</p>
                  </div>
                  <button
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                  >
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <a
                href={`/${currentUser.role === 'admin' ? 'admin' : currentUser.role === 'supervisor' ? 'supervisor' : 'technician'}/notifications`}
                className="text-xs text-blue-600 font-semibold hover:text-blue-800 block text-center"
              >
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
