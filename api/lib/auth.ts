import crypto from 'crypto';

export interface TokenPayload {
  userId: string;
  username: string;
  isAdmin: boolean;
  token: string;
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
