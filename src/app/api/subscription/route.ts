import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Plan from '@/models/Plan';
import { requireUser } from '@/lib/apiAuth';
import { syncSubscriptionStatus, serializeUser } from '@/lib/userSync';

const DAY = 24 * 60 * 60 * 1000;

// GET /api/subscription — current subscription + the plan details.
export async function GET(request: NextRequest) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const user = await User.findById(guard.user.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (syncSubscriptionStatus(user)) await user.save();

    const plan = user.subscription.planKey
      ? await Plan.findOne({ key: user.subscription.planKey }).lean()
      : null;

    return NextResponse.json({
      subscription: serializeUser(user).subscription,
      plan,
    });
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/subscription — { action: 'selectPlan', planKey }
// Starts the plan's free trial (if any); otherwise marks it as pending payment.
export async function POST(request: NextRequest) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const { action, planKey } = await request.json();
    const user = await User.findById(guard.user.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (action !== 'selectPlan') {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    const plan = await Plan.findOne({ key: planKey, active: true });
    if (!plan) return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });

    if (user.subscription.disabledByAdmin) {
      return NextResponse.json({ error: 'Your account plan was disabled by an administrator' }, { status: 403 });
    }

    const now = new Date();
    const sub = user.subscription;
    sub.planKey = plan.key;
    sub.activatedByAdmin = false;
    sub.startDate = null;
    sub.endDate = null;

    const alreadyTrialedThisPlan = sub.trialStartDate && sub.planKey === plan.key;
    if (plan.price === 0) {
      // Free plan: active indefinitely, ad-supported (ads if the plan enables them).
      sub.status = 'active';
      sub.trialStartDate = null;
      sub.trialEndDate = null;
      sub.startDate = now;
      sub.endDate = null;
      sub.adsEnabled = plan.showAds !== false;
    } else if (plan.trialDays > 0 && !alreadyTrialedThisPlan) {
      sub.status = 'trial';
      sub.trialStartDate = now;
      sub.trialEndDate = new Date(now.getTime() + plan.trialDays * DAY);
      sub.adsEnabled = plan.adsDuringTrial;
    } else {
      // No trial available -> requires payment to unlock (handled in Phase 3).
      sub.status = 'expired';
      sub.adsEnabled = false;
    }

    await user.save();
    return NextResponse.json({
      message: sub.status === 'trial' ? 'Trial started'
        : sub.status === 'active' ? 'Free plan activated'
        : 'Plan selected — payment required',
      user: serializeUser(user, now),
    });
  } catch (error) {
    console.error('Subscription POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
