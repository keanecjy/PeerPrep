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
  refreshToken: string;
}

export interface InterviewHistory {
  id: number;
  questionName: string;
  participants: UserProfile[];
  timeTaken: string;
  isCompleted: boolean;
  createdAt: Date;
}
