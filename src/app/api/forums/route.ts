import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireUser } from '@/lib/apiAuth';
import User from '@/models/User';
import Plan from '@/models/Plan';
import { hasPremiumAccess } from '@/lib/entitlements';
import { syncSubscriptionStatus } from '@/lib/userSync';

export const dynamic = 'force-dynamic';

// GET /api/forums — list plan forums with the current user's access state.
export async function GET(request: NextRequest) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const [user, plans] = await Promise.all([
      User.findById(guard.user.userId),
      Plan.find({ forumEnabled: true, active: true }).sort({ order: 1 }),
    ]);
    if (user && syncSubscriptionStatus(user)) await user.save();

    const isAdmin = user?.role === 'admin';
    const member = user && hasPremiumAccess(user.subscription as never);

    return NextResponse.json({
      forums: plans.map((p) => ({
        planKey: p.key,
        name: p.name,
        forumOpen: p.forumOpen !== false,
        canAccess: isAdmin || (!!member && user!.subscription.planKey === p.key),
        isMine: user?.subscription.planKey === p.key,
      })),
      isAdmin,
    });
  } catch (error) {
    console.error('forums list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
