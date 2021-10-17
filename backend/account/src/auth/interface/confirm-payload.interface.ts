/**
 * Payload stored in JWT token to confirm email
 */
export interface EmailConfirmPayload {
  readonly userId: string;
  readonly email: string;
  readonly type: 'confirm';
}
