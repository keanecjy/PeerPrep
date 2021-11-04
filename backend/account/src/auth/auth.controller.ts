import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginAuthGuard } from './guard/login-auth.guard';

import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResendConfirmationDto } from './dto/resend-confirmation.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { AuthUser } from '../shared/decorators/user.decorator';
import { UseAuth } from '../shared/decorators/auth.decorator';

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
  public async login(@AuthUser() user: User): Promise<JwtResponseDto> {
    const accessToken = this.authService.getJwtAccessToken(user);
    const refreshToken = this.authService.getJwtRefreshToken(user);

    await this.authService.saveRefreshToken(refreshToken.token, user);

    return {
      userId: user.id,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      userEmail: user.email,
      expiresIn: +accessToken.expiresIn,
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

    await this.authService.sendEmailConfirmation(user.email).then(() => {
      console.log('Verification email sent');
      return user;
    });

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
    @Body() _refreshTokenDto: RefreshTokenDto
  ): Promise<JwtResponseDto> {
    const newAccessToken = this.authService.getJwtAccessToken(user);
    const newRefreshToken = this.authService.getJwtRefreshToken(user);

    await this.authService.saveRefreshToken(newRefreshToken.token, user);

    return {
      userId: user.id,
      accessToken: newAccessToken.token,
      refreshToken: newRefreshToken.token,
      userEmail: user.email,
      expiresIn: +newAccessToken.expiresIn,
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
  public async logout(@AuthUser() user: User): Promise<string> {
    await this.authService.deleteRefreshToken(user);
    return 'Successfully logged out. See you again!';
  }

  //============ Email Confirmation endpoint ===============

  /**
   * Request email confirmation mail
   */
  @ApiCreatedResponse({
    description: 'Confirmation request sent to email',
  })
  @Post('/resend-confirm')
  public async resendConfirmationEmail(
    @Body() resendConfirmDto: ResendConfirmationDto
  ): Promise<string> {
    await this.authService.sendEmailConfirmation(resendConfirmDto.email);

    return 'Email sent! Check your mailbox for confirmation email.';
  }

  /**
   * Validate user's email confirmation request
   */
  @ApiCreatedResponse({
    description: 'Email confirmed',
  })
  @Post('/confirm')
  public async confirmEmail(
    @Body() confirmEmailDto: ConfirmEmailDto
  ): Promise<string> {
    const isActivated = await this.authService.confirmEmail(confirmEmailDto);

    if (!isActivated) {
      return 'Email already verified. Proceed to login.';
    } else {
      return 'Email successfully verified. Proceed to login.';
    }
  }

  // ============ Password related endpoint ===============

  /**
   * Request password reset email
   */
  @ApiCreatedResponse({
    description: 'Reset request sent to email',
  })
  @Post('/forget-password')
  public async requestPasswordResetEmail(
    @Body() forgetPasswordDto: ForgetPasswordDto
  ): Promise<string> {
    await this.authService.sendPasswordResetUrl(forgetPasswordDto.email);

    return 'Email sent! Check your mailbox for password reset email.';
  }

  /**
   * Validate user's password reset request
   */
  @ApiCreatedResponse({
    description: 'Password successfully reseted',
  })
  @Post('/password-reset')
  public async confirmPasswordReset(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<string> {
    await this.authService.resetPassword(resetPasswordDto);

    return 'Password successfully resetted. Proceed to login.';
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
