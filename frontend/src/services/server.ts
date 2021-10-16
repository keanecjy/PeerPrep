import axios from 'axios';
import { API_URL } from '../shared/variables';
import { apiKeys } from './config';
import RefreshTokenService from './refreshToken';
import { AuthData } from '../shared/types';

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
      err?.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      const res = await server.post(apiKeys.auth.refresh, {
        refreshToken,
      });
      const data = res.data as any as AuthData;
      RefreshTokenService.store(data?.refreshToken || '');

      return server(originalRequest);
    }
    return Promise.reject(err);
  }
);
export default server;
