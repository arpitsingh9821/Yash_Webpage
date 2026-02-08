import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'always-demon-secret-key-2024';

export interface TokenPayload {
  userId: string;
  username: string;
  isAdmin: boolean;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function parseToken(authHeader: string | undefined): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}
