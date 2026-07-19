import axios from 'axios';

export const api = axios.create({
  baseURL : 'https://app-go-389874839960.us-central1.run.app'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@App:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);