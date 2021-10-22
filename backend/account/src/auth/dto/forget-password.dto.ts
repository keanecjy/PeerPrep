import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class ForgetPasswordDto extends PickType(CreateUserDto, ['email']) {}
