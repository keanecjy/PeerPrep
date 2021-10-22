export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  alias?: string;
  photo: string;
}

export interface AuthData {
  userId: string;
  userEmail: string;
  expiresIn: number;
  refreshToken: string;
}
