import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../interface/token-payload.interface';
import { User } from '../../users/user.entity';
import { JwtConfigService } from '../../config/jwt.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    private usersService: UsersService,
    private jwtConfigService: JwtConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.refreshTokenOptions.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload): Promise<User> {
    const { userId, type } = payload;
    const refreshToken = req.body?.refreshToken as string;
    const user = await this.usersService.findById(userId);

    const isTokenMatch = await bcrypt.compare(
      refreshToken,
      user?.refreshTokenHash || ''
    );

    if (!isTokenMatch || type != 'refresh') {
      throw new UnauthorizedException();
    }

    return user;
  }
}
