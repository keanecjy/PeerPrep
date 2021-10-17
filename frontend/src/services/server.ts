import axios from 'axios';
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
      originalRequest.url !== apiKeys.auth.login &&
      originalRequest.url !== apiKeys.auth.refresh &&
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
        });
    }
    return Promise.reject(err);
  }
);
export default server;
