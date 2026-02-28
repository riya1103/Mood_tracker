import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add authorization header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const moodAPI = {
  logMood: (moodData) => api.post('/mood/log', moodData),
  getEntries: (startDate, endDate) => api.get('/mood/entries', { params: { startDate, endDate } }),
  getEntry: (id) => api.get(`/mood/entry/${id}`),
  updateEntry: (id, data) => api.put(`/mood/entry/${id}`, data),
  deleteEntry: (id) => api.delete(`/mood/entry/${id}`),
};

export const insightsAPI = {
  getPatterns: (days = 30) => api.get('/insights/patterns', { params: { days } }),
  getRecommendations: (days = 30) => api.get('/insights/recommendations', { params: { days } }),
  getChartData: () => api.get('/insights/chart-data'),
};

export default api;
