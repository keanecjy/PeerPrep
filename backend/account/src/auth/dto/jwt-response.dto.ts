export class JwtResponseDto {
  userId: string;
  userEmail: string;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
  tokenType: 'cookie';
}
