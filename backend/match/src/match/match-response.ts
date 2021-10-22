import { IsString, IsBoolean } from 'class-validator';

export class MatchResponse {
  @IsBoolean()
  status: boolean;

  @IsString()
  id: string;

  @IsString()
  partnerId?: string;
}
