import { apiKeys } from './config';
import server from './server';

export const interviewPing = () => {
  return server.get(`${apiKeys.serverCheck.interview}`);
};

export const randomQuestion = (
  diff: 'easy' | 'medium' | 'hard',
  lang: 'java' | 'javascript' | 'python'
) => {
  return server.get(`${apiKeys.interview.leetcode.random}`, {
    params: { diff, lang },
  });
};

export const getQuestion = (
  slug: string,
  lang: 'java' | 'javascript' | 'python'
) => {
  return server.get(`${apiKeys.interview.leetcode.find}`, {
    params: { slug, lang },
  });
};
