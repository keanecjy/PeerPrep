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
  participants: UserProfile[];
  timeTaken: number;
  isCompleted: boolean;
  createdAt: Date;
}
