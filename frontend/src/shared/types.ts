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
