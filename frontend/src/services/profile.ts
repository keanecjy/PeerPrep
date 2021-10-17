import server from './server';
import { apiKeys } from './config';
import { UserProfile } from '../shared/types';

export const accountPing = () => {
  return server.get(`${apiKeys.serverCheck.account}`);
};

export const getUserProfile = async () => {
  const res = await server.get(apiKeys.profile.me);
  return res.data as UserProfile;
};

export const getProfileById = async (id: string) => {
  const res = await server.get(`${apiKeys.profile.key}/${id}`);
  return res.data as UserProfile;
};

export const updateProfile = async (id: string) => {
  const res = await server.get(`${apiKeys.profile.key}/${id}`);
  return res.data as UserProfile;
};
