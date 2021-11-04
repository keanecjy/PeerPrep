import server from './server';
import { apiKeys } from './config';
import { InterviewHistory, UserProfile } from '../shared/types';

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

export const updateProfile = async (
  id: string,
  { name, photo }: { name?: string; photo?: string }
) => {
  const res = await server.put(`${apiKeys.profile.key}/${id}`, {
    name,
    photo,
  });
  return res.data as UserProfile;
};

export const getInterviewHistory = async (
  id: string
): Promise<InterviewHistory> => {
  const res = await server.get(`${apiKeys.profile.user_records}/${id}`);
  return res.data as InterviewHistory;
};

export const createInterviewHistory = async (data: {
  leetcodeSlug: string;
  questionName: string;
  partner?: string;
  timeTaken: string;
  completed: boolean;
}): Promise<InterviewHistory> => {
  const res = await server.post(`${apiKeys.profile.records}`, data);
  return res.data as any as InterviewHistory;
};
