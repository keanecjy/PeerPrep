import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  alias: string;

  @IsUrl({
    allow_underscores: true,
  })
  @IsOptional()
  photo: string;
}
