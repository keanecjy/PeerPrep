import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginAuthGuard } from './guard/login-auth.guard';

import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { AuthUser } from '../shared/decorators/user.decorator';
import { UseAuth } from '../shared/decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login to an account
   */
  @ApiCreatedResponse({
    description: 'Successfully logged in',
    type: JwtResponseDto,
  })
  @ApiBody({ type: LoginUserDto })
  @UseAuth(LoginAuthGuard, 'Wrong email or password')
  @Post('/login')
  public async login(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response
  ): Promise<JwtResponseDto> {
    const accessTokenCookie = this.authService.getJwtAccessTokenCookie(user);
    const refreshToken = this.authService.getJwtRefreshTokenCookie(user);

    await this.authService.saveRefreshToken(refreshToken.token, user);

    response.setHeader('Set-Cookie', [accessTokenCookie.cookie]);
    return {
      userId: user.id,
      refreshToken: refreshToken.token,
      userEmail: user.email,
      expiresIn: +accessTokenCookie.expiresIn,
      tokenType: 'cookie',
    };
  }

  /**
   * Create an account
   */
  @ApiCreatedResponse({
    description: 'Successfully created. Proceed to login',
  })
  @ApiBadRequestResponse({
    description: 'Missing or invalid registration details',
  })
  @ApiConflictResponse({ description: 'Email already exists' })
  @Post('/signup')
  public async signup(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user = await this.authService.signup(createUserDto);

    // await this.authService.sendEmailConfirmation(user.email).then(() => {
    //   console.log('Verification email sent');
    //   return user;
    // });

    return 'Successfully created account. Please verify email before logging in';
  }

  /**
   * Request a new JWT access token
   */
  @ApiCreatedResponse({
    description: 'Successfully refreshed access token',
    type: JwtResponseDto,
  })
  @ApiBody({ type: RefreshTokenDto })
  @UseAuth(JwtRefreshGuard, 'Invalid refresh token')
  @Post('/refresh')
  public async refresh(
    @AuthUser() user: User,
    @Body() _refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<JwtResponseDto> {
    const newAccessTokenCookie = this.authService.getJwtAccessTokenCookie(user);
    const newRefreshToken = this.authService.getJwtRefreshTokenCookie(user);

    await this.authService.saveRefreshToken(newRefreshToken.token, user);

    response.setHeader('Set-Cookie', [newAccessTokenCookie.cookie]);
    return {
      userId: user.id,
      refreshToken: newRefreshToken.token,
      userEmail: user.email,
      expiresIn: +newAccessTokenCookie.expiresIn,
      tokenType: 'cookie',
    };
  }

  /**
   * Logout of the account
   */
  @ApiCreatedResponse({
    description: 'Successfully logged out',
  })
  @UseAuth(JwtAuthGuard)
  @Post('/logout')
  public async logout(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response
  ): Promise<string> {
    const logoutCookies = this.authService.getLogoutCookies();
    await this.authService.deleteRefreshToken(user);
    response.setHeader('Set-Cookie', logoutCookies);
    return 'Successfully logged out. See you again!';
  }

  /**
   * Request to Change password
   */
  @UseAuth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Password changed',
  })
  @Post('/change-password')
  public async changePassword(
    @AuthUser() requester: User,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<string> {
    await this.authService.changePassword(requester, changePasswordDto);

    return 'Password successfully changed';
  }
}
