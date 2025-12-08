import apiClient from './apiClient';

// ============================================
// AUTH & USER APIs
// ============================================

export const authAPI = {
  // Get current user from DB (synced by backend)
  getCurrentUser: () => apiClient.get('/users/me'),

  // Update current user profile
  updateProfile: (data) => apiClient.patch('/users/me', data),

  // Get current user statistics
  getUserStats: () => apiClient.get('/users/me/stats'),

  // Get current user's payments
  getUserPayments: () => apiClient.get('/users/me/payments'),
};

// ============================================
// ISSUES APIs
// ============================================

export const issuesAPI = {
  // Get all issues with pagination, search, filters
  getAll: (params) => apiClient.get('/issues', { params }),

  // Get single issue by ID
  getById: (id) => apiClient.get(`/issues/${id}`),

  // Create new issue
  create: (data) => apiClient.post('/issues', data),

  // Update issue (owner, pending only)
  update: (id, data) => apiClient.patch(`/issues/${id}`, data),

  // Delete issue (owner only)
  delete: (id) => apiClient.delete(`/issues/${id}`),

  // Upvote issue
  upvote: (id) => apiClient.post(`/issues/${id}/upvote`),
};

// ============================================
// ADMIN APIs
// ============================================

export const adminAPI = {
  // Issues management
  assignStaff: (issueId, staffId) =>
    apiClient.post(`/admin/issues/${issueId}/assign-staff`, { staffId }),

  rejectIssue: (issueId) =>
    apiClient.post(`/admin/issues/${issueId}/reject`),

  // Users management
  getAllUsers: () => apiClient.get('/admin/users'),

  blockUser: (userId) => apiClient.post(`/admin/users/${userId}/block`),

  unblockUser: (userId) => apiClient.post(`/admin/users/${userId}/unblock`),

  // Staff management
  getAllStaff: () => apiClient.get('/admin/staff'),

  createStaff: (data) => apiClient.post('/admin/staff', data),

  updateStaff: (staffId, data) => apiClient.patch(`/admin/staff/${staffId}`, data),

  deleteStaff: (staffId) => apiClient.delete(`/admin/staff/${staffId}`),

  // Admin statistics
  getStats: () => apiClient.get('/admin/stats'),
};

// ============================================
// STAFF APIs
// ============================================

export const staffAPI = {
  // Get assigned issues
  getAssignedIssues: () => apiClient.get('/staff/issues'),

  // Change issue status
  changeStatus: (issueId, status) =>
    apiClient.post(`/staff/issues/${issueId}/status`, { status }),

  // Get staff statistics
  getStats: () => apiClient.get('/staff/stats'),
};

// ============================================
// PAYMENTS APIs
// ============================================

export const paymentsAPI = {
  // Create boost payment intent
  createBoostIntent: (issueId) =>
    apiClient.post('/payments/boost-intent', { issueId }),

  // Confirm boost payment
  confirmBoost: (paymentIntentId) =>
    apiClient.post('/payments/boost/confirm', { paymentIntentId }),

  // Create subscription payment intent
  createSubscriptionIntent: () =>
    apiClient.post('/payments/subscription-intent'),

  // Confirm subscription payment
  confirmSubscription: (paymentIntentId) =>
    apiClient.post('/payments/subscription/confirm', { paymentIntentId }),

  // Get all payments (admin only)
  getAll: () => apiClient.get('/payments'),
};

// ============================================
// IMAGE UPLOAD (ImgBB)
// ============================================

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const imgbbApiKey = import.meta.env.VITE_image_host_key;
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    return data.data.url;
  } else {
    throw new Error('Image upload failed');
  }
};

// Export all APIs as a single object for convenience
export default {
  auth: authAPI,
  issues: issuesAPI,
  admin: adminAPI,
  staff: staffAPI,
  payments: paymentsAPI,
  uploadImage,
};
