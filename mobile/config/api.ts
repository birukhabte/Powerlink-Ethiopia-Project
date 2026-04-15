// API Configuration — mirrors web frontend/src/config/api.js
// Uses EXPO_PUBLIC_API_URL env var for different environments

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  serviceRequests: {
    base: `${API_BASE_URL}/api/service-requests`,
    pending: `${API_BASE_URL}/api/service-requests/pending`,
    byUser: (userId: string) => `${API_BASE_URL}/api/service-requests/user/${userId}`,
    approve: (id: string) => `${API_BASE_URL}/api/service-requests/${id}/approve`,
    reject: (id: string) => `${API_BASE_URL}/api/service-requests/${id}/reject`,
  },
  announcements: {
    base: `${API_BASE_URL}/api/announcements`,
    admin: `${API_BASE_URL}/api/announcements/admin`,
    byId: (id: string) => `${API_BASE_URL}/api/announcements/${id}`,
    toggle: (id: string) => `${API_BASE_URL}/api/announcements/${id}/toggle`,
  },
  outages: {
    base: `${API_BASE_URL}/api/outages`,
  },
  users: {
    base: `${API_BASE_URL}/api/users`,
    updateRole: (userId: string) => `${API_BASE_URL}/api/users/${userId}/role`,
  },
  dashboard: {
    technician: `${API_BASE_URL}/api/dashboard/technician`,
    supervisor: `${API_BASE_URL}/api/dashboard/supervisor`,
  },
  messages: {
    base: `${API_BASE_URL}/api/messages`,
    read: (contactId: string) => `${API_BASE_URL}/api/messages/read/${contactId}`,
  },
  notifications: {
    base: `${API_BASE_URL}/api/notifications`,
    readOne: (id: string) => `${API_BASE_URL}/api/notifications/read/${id}`,
    readAll: `${API_BASE_URL}/api/notifications/read-all`,
  },
  schedule: `${API_BASE_URL}/api/schedule`,
  uploads: {
    serviceDocuments: `${API_BASE_URL}/api/uploads/service-documents`,
    download: (ticketId: string, fileName: string) =>
      `${API_BASE_URL}/api/uploads/download/${ticketId}/${fileName}`,
    getFile: (path: string) => `${API_BASE_URL}${path}`,
  },
};

export default API_BASE_URL;
