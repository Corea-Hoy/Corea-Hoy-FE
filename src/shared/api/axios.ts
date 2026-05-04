import axios from 'axios';
import { ENV } from '@/shared/config/env';

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? '';
    return Promise.reject(error);
  },
);

export default api;
