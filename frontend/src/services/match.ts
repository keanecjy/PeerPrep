import { apiKeys } from './config';
import server from './server';

export const matchPing = () => {
  return server.get(`${apiKeys.serverCheck.match}`);
};
