import { MatchResponse } from '../match/match-response';
import { apiKeys } from './config';
import server from './server';

export const matchPing = () => {
  return server.get(`${apiKeys.serverCheck.match}`);
};

export const getMatch = async (
  id: string,
  difficulty: string,
  language: string
) => {
  const res = await server.get(apiKeys.match.find, {
    params: {
      id: id,
      difficulty: difficulty,
      language: language,
    },
  });
  return res.data as MatchResponse;
};
