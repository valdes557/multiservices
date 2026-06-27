import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/apiAuth';
import { effectiveStatus } from '@/lib/entitlements';

// GET /api/admin/users — list users with their resolved subscription status.
export async function GET(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    const filter = q
      ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] }
      : {};

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const now = new Date();
    return NextResponse.json({
      users: users.map((u) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        subscription: u.subscription,
        effectiveStatus: effectiveStatus(u.subscription as never, now),
      })),
    });
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
