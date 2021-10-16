import server from './server';
import { apiKeys } from './config';
import { getRefTokenKey, removeRefTokenKey } from './storage';
import { AuthData } from '../shared/types';

export const login = async (email: string, password: string) => {
  const res = await server.post(apiKeys.auth.login, {
    email,
    password,
  });
  return res.data as any as AuthData;
};

export const refresh = async () => {
  const refreshToken = getRefTokenKey();
  if (!refreshToken) {
    throw Error('No refresh token');
  }

  const res = await server.post(apiKeys.auth.refresh, {
    refreshToken,
  });
  return res.data as any as AuthData;
};

export const signup = async (signupDetails: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) => {
  const res = await server.post(apiKeys.auth.signup, signupDetails);
  return res.data as any as string;
};

export const logout = async () => {
  await server.post(apiKeys.auth.logout);
  removeRefTokenKey();
  return true;
};

export const resendConfirmationMail = async (email: string) => {
  const res = await server.post(apiKeys.auth.resendConfirm, { email });
  return res.data as any as string;
};

export const verifyEmailConfirmation = async (token: string) => {
  const res = await server.post(apiKeys.auth.confirm, { token });
  return res.data as any as string;
};

export const sendPasswordReset = async (email: string) => {
  const res = await server.post(apiKeys.auth.forgetPassword, { email });
  return res.data as any as string;
};

export const processPasswordReset = async (token: string, password: string) => {
  const res = await server.post(apiKeys.auth.forgetPassword, {
    token,
    password,
  });
  return res.data as any as string;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const res = await server.post(apiKeys.auth.changePassword, {
    oldPassword,
    newPassword,
  });
  return res.data as any as string;
};
