import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
