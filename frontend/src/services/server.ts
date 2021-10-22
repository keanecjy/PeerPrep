import axios from 'axios';
import { toast } from 'react-toastify';

import { API_URL } from '../shared/variables';
import { apiKeys } from './config';
import RefreshTokenService from './refreshToken';

const server = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

server.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const refreshToken = RefreshTokenService.get();
    if (
      !originalRequest.url?.startsWith('/auth') &&
      err?.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      return server
        .post(apiKeys.auth.refresh, {
          refreshToken,
        })
        .then((res) => {
          if (res.status === 201) {
            RefreshTokenService.store(res.data?.refreshToken || '');
            return server(originalRequest);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            RefreshTokenService.remove();
            toast.error('Not logged in');
            return Promise.reject();
          }
        });
    }
    return Promise.reject(err);
  }
);
export default server;
