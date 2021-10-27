import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from '../users/user.entity';
import { MailConfigService } from '../config/mail.config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private mailConfigService: MailConfigService
  ) {}

  async sendEmailConfirmation(user: User, url: string): Promise<boolean> {
    console.log(this.mailConfigService.pass);
    await this.mailerService.sendMail({
      from: {
        name: 'PeerPrep Team',
        address: this.mailConfigService.user,
      },
      to: user.email,
      subject: 'PeerPrep Email Confirmation',
      template: './index',
      context: {
        title: 'Email Confirmation',
        username: user.profile?.name || 'there',
        content:
          'Welcome to PeerPrep!\n' +
          'Please click the button below to verify your account',
        action_url: url,
        action_text: 'Confirm email',
      },
    });

    return true;
  }

  async sendPasswordReset(user: User, url: string): Promise<boolean> {
    await this.mailerService.sendMail({
      from: {
        name: 'PeerPrep Team',
        address: this.mailConfigService.user,
      },
      to: user.email,
      subject: 'PeerPrep Password Reset',
      template: './index',
      context: {
        title: 'Password reset',
        username: user.profile?.name || 'there',
        content:
          'You requested to reset your password.\n' +
          'Please click the button below to reset your password.',
        action_url: url,
        action_text: 'Reset password',
      },
    });

    return true;
  }
}
