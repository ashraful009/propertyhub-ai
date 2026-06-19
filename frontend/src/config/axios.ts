import axios from 'axios';
import { ENV } from './env';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        
        
        
        
        
        
        
        
        useAuthStore.getState().logout();
      } catch (err) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
