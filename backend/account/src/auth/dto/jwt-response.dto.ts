export class JwtResponseDto {
  userId: string;
  userEmail: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: 'cookie';
}
