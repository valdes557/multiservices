import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type JwtPayload } from '@/lib/auth';

/**
 * Extract & verify the JWT from an API request (Authorization: Bearer or cookie).
 * Returns the decoded payload, or null.
 */
export function authenticate(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get('authorization');
  let token: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = request.cookies.get('token')?.value ?? null;
  }
  if (!token) return null;
  return verifyToken(token);
}

/** Guard for routes that require any authenticated user. */
export function requireUser(request: NextRequest): { user: JwtPayload } | { error: NextResponse } {
  const decoded = authenticate(request);
  if (!decoded) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user: decoded };
}

/** Guard for routes that require an administrator. */
export function requireAdmin(request: NextRequest): { user: JwtPayload } | { error: NextResponse } {
  const decoded = authenticate(request);
  if (!decoded) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (decoded.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 }) };
  }
  return { user: decoded };
}
