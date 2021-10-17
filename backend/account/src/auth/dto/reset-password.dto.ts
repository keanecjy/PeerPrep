import { PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class ResetPasswordDto extends PickType(CreateUserDto, ['password']) {
  @IsString()
  @IsNotEmpty()
  token: string;
}
