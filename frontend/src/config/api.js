// API Configuration
// This file centralizes all API endpoint configurations
// Uses environment variables for different deployment environments

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  
  // Service Requests
  serviceRequests: {
    base: `${API_BASE_URL}/api/service-requests`,
    pending: `${API_BASE_URL}/api/service-requests/pending`,
    byUser: (userId) => `${API_BASE_URL}/api/service-requests/user/${userId}`,
    approve: (requestId) => `${API_BASE_URL}/api/service-requests/${requestId}/approve`,
    reject: (requestId) => `${API_BASE_URL}/api/service-requests/${requestId}/reject`,
  },
  
  // Announcements
  announcements: {
    base: `${API_BASE_URL}/api/announcements`,
    admin: `${API_BASE_URL}/api/announcements/admin`,
    byId: (id) => `${API_BASE_URL}/api/announcements/${id}`,
    toggle: (id) => `${API_BASE_URL}/api/announcements/${id}/toggle`,
  },
  
  // Outages
  outages: {
    base: `${API_BASE_URL}/api/outages`,
  },
  
  // Users
  users: {
    base: `${API_BASE_URL}/api/users`,
    updateRole: (userId) =>
  `${API_BASE_URL}/api/users/update-role/${userId}`,
  },
  
  dashboard: {
    technician: `${API_BASE_URL}/api/dashboard/technician`,
    supervisor: `${API_BASE_URL}/api/dashboard/supervisor`,
  },
  // Uploads
  uploads: {
    serviceDocuments: `${API_BASE_URL}/api/uploads/service-documents`,
    download: (ticketId, fileName) => `${API_BASE_URL}/api/uploads/download/${ticketId}/${fileName}`,
    getFile: (path) => `${API_BASE_URL}${path}`,
  },
};

export default API_BASE_URL;
