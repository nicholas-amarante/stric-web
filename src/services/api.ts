import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { isTokenExpired } from '../utils/jwt';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stric-api.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Interceptor de Requisição: Injeta o token JWT no Header Authorization
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('@stric:token');
    if (token) {
      if (isTokenExpired(token)) {
        // Se o token estiver expirado, remove e não envia header Authorization
        localStorage.removeItem('@stric:token');
        localStorage.removeItem('@stric:user');
      } else if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: Desencapsula ApiResponse do Spring Boot e trata 401
api.interceptors.response.use(
  (response) => {
    // Se a API Spring Boot retornar encapsulado em { success: true, data: ... }
    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data &&
      'success' in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response?.status === 401) {
      // NUNCA deslogar nem redirecionar se o erro for na autenticação do login ou na validação de senha do perfil
      const isExempt = 
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/profile') ||
        window.location.pathname.includes('/login');

      if (!isExempt) {
        localStorage.removeItem('@stric:token');
        localStorage.removeItem('@stric:user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
