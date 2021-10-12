import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      usernameQueryFields: ['email'],
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user: User = await this.authService.validateLogin(email, password);
    if (!user) {
      throw new UnauthorizedException(
        'Wrong email or password. Please try again.'
      );
    }
    return user;
  }
}
