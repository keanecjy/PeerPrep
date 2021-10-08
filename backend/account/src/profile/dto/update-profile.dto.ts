import { IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  alias?: string;

  @IsUrl({
    allow_underscores: true,
  })
  photo?: string;
}
