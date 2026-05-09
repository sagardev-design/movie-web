import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

export const setAuthTokenGetter = (tokenGetter) => {
  api.defaults.getAuthToken = tokenGetter;
};

api.interceptors.request.use(async (config) => {
  const token = api.defaults.getAuthToken ? await api.defaults.getAuthToken({ skipCache: true }) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
