import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

// Verify JWT token (Edge Runtime compatible)
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Check if user has required role
export function hasRole(user: JWTPayload | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
