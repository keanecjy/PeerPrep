export interface UserProfile {
  id: string;
  name: string;
  photo: string;
  isGuest?: boolean;
}

export interface AuthData {
  userId: string;
  userEmail: string;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
}

export interface InterviewHistory {
  id: number;
  questionName: string;
  partnerName: string;
  timeTaken: number;
  isCompleted: boolean;
  createdAt: Date;
}
