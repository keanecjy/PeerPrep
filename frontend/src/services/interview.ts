import { apiKeys } from './config';
import server from './server';

export const interviewPing = () => {
  return server.get(`${apiKeys.serverCheck.interview}`);
};
