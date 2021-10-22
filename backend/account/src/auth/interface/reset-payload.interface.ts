/**
 * Payload stored in JWT token to reset password
 */
export interface PasswordResetPayload {
  readonly userId: string;
  readonly hash: string;
  readonly type: 'reset';
}
