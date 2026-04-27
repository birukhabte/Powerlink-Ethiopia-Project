// API Configuration
// Centralizes all API endpoint configurations.
// Uses environment variables for different deployment environments.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login:    `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },

  // Users
  users: {
    base:       `${API_BASE_URL}/api/users`,
    byId:       (id) => `${API_BASE_URL}/api/users/${id}`,
    updateRole: (id) => `${API_BASE_URL}/api/users/update-role/${id}`,
    toggle:     (id) => `${API_BASE_URL}/api/users/${id}/toggle`,
    update:     (id) => `${API_BASE_URL}/api/users/${id}`,
    delete:     (id) => `${API_BASE_URL}/api/users/${id}`,
  },

  // Admin
  admin: {
    stats:       `${API_BASE_URL}/api/admin/stats`,
    users:       `${API_BASE_URL}/api/admin/users`,
    technicians: `${API_BASE_URL}/api/admin/technicians`,
  },

  // Service Requests
  serviceRequests: {
    base:         `${API_BASE_URL}/api/service-requests`,
    pending:      `${API_BASE_URL}/api/service-requests/pending`,
    byUser:       (userId) => `${API_BASE_URL}/api/service-requests/user/${userId}`,
    byId:         (id)     => `${API_BASE_URL}/api/service-requests/${id}`,
    approve:      (id)     => `${API_BASE_URL}/api/service-requests/${id}/approve`,
    reject:       (id)     => `${API_BASE_URL}/api/service-requests/${id}/reject`,
    update:       (id)     => `${API_BASE_URL}/api/service-requests/${id}`,
  },

  // Outages
  outages: {
    base:     `${API_BASE_URL}/api/outages`,
    byId:     (id) => `${API_BASE_URL}/api/outages/${id}`,
    status:   (id) => `${API_BASE_URL}/api/outages/${id}/status`,
    assign:   (id) => `${API_BASE_URL}/api/outages/${id}/assign`,
    byUser:   (userId) => `${API_BASE_URL}/api/outages/user/${userId}`,
    manage:   `${API_BASE_URL}/api/outages/manage`,
  },

  // Announcements
  announcements: {
    base:   `${API_BASE_URL}/api/announcements`,
    admin:  `${API_BASE_URL}/api/announcements/admin`,
    byId:   (id) => `${API_BASE_URL}/api/announcements/${id}`,
    toggle: (id) => `${API_BASE_URL}/api/announcements/${id}/toggle`,
  },

  // Messages / Chat
  messages: {
    base:         `${API_BASE_URL}/api/messages`,
    contacts:     `${API_BASE_URL}/api/messages/contacts`,
    staff:        `${API_BASE_URL}/api/messages/staff`,
    conversation: (userId) => `${API_BASE_URL}/api/messages/conversation/${userId}`,
    markRead:     (senderId) => `${API_BASE_URL}/api/messages/read/${senderId}`,
  },

  // Notifications
  notifications: {
    base:      `${API_BASE_URL}/api/notifications`,
    markRead:  (id) => `${API_BASE_URL}/api/notifications/read/${id}`,
    markAll:   `${API_BASE_URL}/api/notifications/read-all`,
    delete:    (id) => `${API_BASE_URL}/api/notifications/${id}`,
  },

  // Dashboard
  dashboard: {
    technician: `${API_BASE_URL}/api/dashboard/technician`,
    supervisor: `${API_BASE_URL}/api/dashboard/supervisor`,
  },

  // Uploads
  uploads: {
    serviceDocuments: `${API_BASE_URL}/api/uploads/service-documents`,
    download: (ticketId, fileName) => `${API_BASE_URL}/api/uploads/download/${ticketId}/${fileName}`,
    getFile:  (path) => `${API_BASE_URL}${path}`,
  },

  // Schedule
  schedule: {
    base: `${API_BASE_URL}/api/schedule`,
  },

  // Technician
  technician: {
    tasks:      `${API_BASE_URL}/api/technician/tasks`,
    updateTask: (type, id) => `${API_BASE_URL}/api/technician/task/${type}/${id}`,
  },
};

export { API_BASE_URL };
export default API_BASE_URL;
