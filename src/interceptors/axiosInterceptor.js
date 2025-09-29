import axios from 'axios';
import store from '@/store';
import AuthApiService from '@/services/authApiService';
import { log } from '@/utils/log';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const setupInterceptors = () => {
  // Request interceptor to add token to every request
  axios.interceptors.request.use(
    (config) => {
      const token = store.getters['auth/accessToken'];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        log('Request interceptor: Token added to request');
      }
      return config;
    },
    (error) => {
      log('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  axios.interceptors.response.use(
    (response) => {
      log('Response interceptor: Request successful');
      return response;
    },
    async (error) => {
      log('Response interceptor: Request failed', error.response?.status);
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        log('Handling 401 error - attempting token refresh');

        if (isRefreshing) {
          log('Token refresh already in progress - queuing request');
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = store.getters['auth/refreshToken'];
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          log('Refreshing token...');
          const response = await AuthApiService.refreshToken(refreshToken);
          const newToken = response.data.access;

          log('Token refresh successful');
          store.dispatch('auth/setAccessToken', newToken);
          AuthApiService.setAccessToken(newToken);

          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          log('Token refresh failed:', refreshError);
          processQueue(refreshError, null);
          store.dispatch('auth/logout');
          window.location.href = '/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  log('Axios interceptors setup complete');
};

export default setupInterceptors;
