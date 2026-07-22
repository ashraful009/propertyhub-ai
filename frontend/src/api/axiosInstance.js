import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.headers['Content-Type']?.includes('multipart/form-data')) {
      config.timeout = 60000;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) window.dispatchEvent(new CustomEvent('auth:expired'));
    if (status === 403) window.dispatchEvent(new CustomEvent('auth:forbidden'));
    return Promise.reject(error);
  }
);

export default axiosInstance;
