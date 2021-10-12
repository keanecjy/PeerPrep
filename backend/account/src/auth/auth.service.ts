import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AppConfigService } from '../config/app.config';
import { JwtConfigService } from '../config/jwt.config';
import { generateCookie } from '../shared/utils/cookies.helper';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenPayload } from './interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly appConfigService: AppConfigService
  ) {}

  /**
   * Gets login user using email and password
   */
  public async validateLogin(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    // check password
    if (!user || !user.passwordHash) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }
    return user;
  }

  public async getUserFromToken(accessToken: string): Promise<User> {
    let payload: TokenPayload;
    try {
      payload = this.jwtService.verify<TokenPayload>(accessToken, {
        ignoreExpiration: false,
        secret: this.jwtConfigService.accessTokenOptions.secret,
      });
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }

    return this.usersService.findById(payload.userId);
  }

  public getJwtAccessTokenCookie(user: User) {
    const payload: TokenPayload = {
      userId: user.id,
      type: 'access',
    };
    const jwtOptions = this.jwtConfigService.accessTokenOptions;
    const token = this.jwtService.sign(payload, {
      secret: jwtOptions.secret,
      expiresIn: `${jwtOptions.expiry}s`,
    });

    const cookie = generateCookie({
      name: 'tkn',
      value: token,
      httpOnly: true,
      sameSite: 'Strict',
      secure: this.appConfigService.isProd,
      path: '/',
      maxAge: jwtOptions.expiry,
    });
    return { cookie, token, expiresIn: jwtOptions.expiry };
  }

  public getJwtRefreshTokenCookie(user: User) {
    const payload: TokenPayload = {
      userId: user.id,
      type: 'refresh',
    };
    const refreshOptions = this.jwtConfigService.refreshTokenOptions;
    const token = this.jwtService.sign(payload, {
      secret: refreshOptions.secret,
      expiresIn: `${refreshOptions.expiry}s`,
    });

    return { token, expiresIn: refreshOptions.expiry };
  }

  public getLogoutCookies() {
    const unsetRefreshCookie = generateCookie({
      name: 'ref',
      value: '',
      httpOnly: true,
      sameSite: 'Strict',
      secure: this.appConfigService.isProd,
      path: '/',
      maxAge: 0,
    });

    const unsetAccessCookie = generateCookie({
      name: 'tkn',
      value: '',
      httpOnly: true,
      sameSite: 'Strict',
      secure: this.appConfigService.isProd,
      path: '/',
      maxAge: 0,
    });
    return [unsetRefreshCookie, unsetAccessCookie];
  }

  public async saveRefreshToken(
    refreshToken: string,
    user: User
  ): Promise<boolean> {
    const hashedToken = await bcrypt.hash(refreshToken, 12);
    return this.usersService.setRefreshToken(hashedToken, user.id);
  }

  public deleteRefreshToken(user: User): Promise<boolean> {
    return this.usersService.removeRefreshToken(user.id);
  }

  public async signup(createUserDto: CreateUserDto): Promise<User> {
    if (await this.usersService.doesEmailExist(createUserDto.email)) {
      throw new ConflictException('Email already exists');
    }

    const { password, email, firstName, lastName } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 12);
    return this.usersService.createUser({
      email,
      firstName,
      lastName,
      passwordHash,
    });
  }

  public async changePassword(
    requester: User,
    changePasswordDto: ChangePasswordDto
  ): Promise<boolean> {
    const { newPassword, oldPassword } = changePasswordDto;

    const match = await bcrypt.compare(oldPassword, requester.passwordHash);
    if (!match) {
      throw new BadRequestException('Incorrect password');
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    const success = await this.usersService.setPasswordHash(
      requester.id,
      newPasswordHash
    );

    if (!success) {
      throw new BadRequestException('Password change failed. Please try again');
    }
    return true;
  }
}
