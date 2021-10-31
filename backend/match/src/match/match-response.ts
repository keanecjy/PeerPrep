import { IsString, IsBoolean } from 'class-validator';

export class MatchResponse {
  @IsBoolean()
  status: boolean;

  @IsString()
  id: string;

  @IsString()
  partnerId?: string;

  @IsString()
  sessionId?: string;

  @IsString()
  difficulty: string;

  @IsString()
  language: string;
}
