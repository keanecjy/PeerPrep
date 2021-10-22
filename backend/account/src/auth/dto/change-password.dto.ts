import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  // @example password
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  // @example password
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
