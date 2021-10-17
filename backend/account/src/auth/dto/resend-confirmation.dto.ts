import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class ResendConfirmationDto extends PickType(CreateUserDto, ['email']) {}
