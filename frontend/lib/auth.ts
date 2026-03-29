import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Get token from cookies
export function getTokenFromCookies(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token');
  return token?.value || null;
}

// Get current user from token
export function getCurrentUser(): JWTPayload | null {
  const token = getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

// Check if user has required role
export function hasRole(user: JWTPayload | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

// Generate password reset token
export function generateResetToken(): string {
  return jwt.sign({ purpose: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
}
