import axios from 'axios';

/**
 * API client instance
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API error:', error);
    throw error;
  }
);

/**
 * Extract brand from URL
 * @param {string} url
 * @returns {Promise<Object>}
 */
export const extractBrandAPI = (url) => {
  return apiClient.post('/api/extract-brand', { url });
};

/**
 * Generate prompt with Gemini
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const generatePromptAPI = (params) => {
  return apiClient.post('/api/generate-prompt', params);
};

/**
 * Generate images with Imagen
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const generateImagesAPI = (params) => {
  return apiClient.post('/api/generate-images', params);
};

/**
 * Get projects
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getProjectsAPI = (userId) => {
  return apiClient.get('/api/projects', { params: { userId } });
};

/**
 * Create project
 * @param {Object} project
 * @returns {Promise<Object>}
 */
export const createProjectAPI = (project) => {
  return apiClient.post('/api/projects', project);
};

/**
 * Get project
 * @param {string} projectId
 * @returns {Promise<Object>}
 */
export const getProjectAPI = (projectId) => {
  return apiClient.get(`/api/projects/${projectId}`);
};

/**
 * Update project
 * @param {string} projectId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateProjectAPI = (projectId, updates) => {
  return apiClient.put(`/api/projects/${projectId}`, updates);
};

/**
 * Delete project
 * @param {string} projectId
 * @returns {Promise<void>}
 */
export const deleteProjectAPI = (projectId) => {
  return apiClient.delete(`/api/projects/${projectId}`);
};

export default apiClient;
