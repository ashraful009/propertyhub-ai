import axios from 'axios';
import { ENV } from './env';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true, // For sending HTTP-only cookies
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

// Intercept 401 Unauthorized for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Here we would call the refresh token endpoint
        // const res = await axios.post(`${ENV.API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        // const newAccessToken = res.data.accessToken;
        // useAuthStore.getState().setAccessToken(newAccessToken);
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // return api(originalRequest);
        
        // For now, if refresh fails or isn't implemented, log out
        useAuthStore.getState().logout();
      } catch (err) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
