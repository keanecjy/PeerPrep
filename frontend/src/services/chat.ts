import { apiKeys } from './config';
import server from './server';

export const chatPing = () => {
  return server.get(`${apiKeys.serverCheck.chat}`);
};
