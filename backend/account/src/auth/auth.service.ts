import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { AppConfigService } from '../config/app.config';
import { JwtConfigService } from '../config/jwt.config';
import { generateCookie } from '../shared/utils/cookies.helper';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailConfirmPayload } from './interface/confirm-payload.interface';
import { PasswordResetPayload } from './interface/reset-payload.interface';
import { TokenPayload } from './interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly appConfigService: AppConfigService,
    private readonly mailService: MailService
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

  public async sendEmailConfirmation(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    const payload: EmailConfirmPayload = {
      userId: user.id,
      email: user.email,
      type: 'confirm',
    };
    const mailOptions = this.jwtConfigService.mailVerifyTokenOptions;
    const token = this.jwtService.sign(payload, {
      secret: mailOptions.secret,
      expiresIn: `${mailOptions.expiry}s`,
    });

    console.log('Confirm email token:', token);
    const url = `${this.appConfigService.clientUrl}/login?state=check&token=${token}`;

    return this.mailService.sendEmailConfirmation(user, url);
  }

  public async sendPasswordResetUrl(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    const payload: PasswordResetPayload = {
      userId: user.id,
      hash: user.passwordHash,
      type: 'reset',
    };
    const mailOptions = this.jwtConfigService.passwordResetTokenOptions;
    const token = this.jwtService.sign(payload, {
      secret: mailOptions.secret,
      expiresIn: `${mailOptions.expiry}s`,
    });

    console.log('Password reset token:', token);
    const url = `${this.appConfigService.clientUrl}/login?state=reset&token=${token}`;

    return this.mailService.sendPasswordReset(user, url);
  }

  public confirmEmail(confirmEmailDto: ConfirmEmailDto): Promise<boolean> {
    try {
      const { token } = confirmEmailDto;
      let payload: EmailConfirmPayload;
      try {
        payload = this.jwtService.verify<EmailConfirmPayload>(token, {
          ignoreExpiration: false,
          secret: this.jwtConfigService.mailVerifyTokenOptions.secret,
        });
      } catch (error) {
        throw new BadRequestException('Invalid token');
      }

      const { email } = payload;
      return this.usersService.activateAccount(email);
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<string> {
    const { token, password } = resetPasswordDto;
    let payload: PasswordResetPayload;

    try {
      payload = this.jwtService.verify<PasswordResetPayload>(token, {
        ignoreExpiration: false,
        secret: this.jwtConfigService.passwordResetTokenOptions.secret,
      });
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }

    const { userId, hash: previousHash } = payload;
    const user = await this.usersService.findById(userId);

    if (previousHash !== user.passwordHash) {
      // invalid password hash in jwt token
      throw new UnauthorizedException();
    }
    const newPasswordHash = await bcrypt.hash(password, 12);
    const resetStatus = await this.usersService.setPasswordHash(
      userId,
      newPasswordHash
    );
    if (!resetStatus) {
      throw new BadRequestException('Password reset failed. Please try again');
    } else {
      return 'Password successfully resetted. Proceed to login.';
    }
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
