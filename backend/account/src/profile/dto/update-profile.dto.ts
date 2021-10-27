import { IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  name?: string;

  @IsUrl({
    allow_underscores: true,
  })
  photo?: string;
}
