import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // 🌟 Mude para isso! Sem localhost e sem a URL do Cloud Run aqui.
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