import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Plan from '@/models/Plan';
import { requireAdmin } from '@/lib/apiAuth';
import { effectiveStatus } from '@/lib/entitlements';

const DAY = 24 * 60 * 60 * 1000;

/**
 * PATCH /api/admin/users/:id — administrative actions on a user's subscription.
 * Body: { action, ...params }
 *
 *  - assignPlan   { planKey }            : put the user on a plan and start its trial (if any), else mark expired pending payment.
 *  - activateMonthly { planKey?, months?}: activate a PAID monthly subscription and BLOCK ads — works even during the trial.
 *  - disablePlan                          : deactivate the user's plan (no access).
 *  - enablePlan                           : re-enable a previously disabled plan.
 *  - setAds       { adsEnabled }          : toggle whether trial ads run for this user.
 *  - expire                               : force the subscription to expired.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const { action, ...payload } = await request.json();
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const sub = user.subscription;
    const now = new Date();

    switch (action) {
      case 'assignPlan': {
        const plan = await Plan.findOne({ key: payload.planKey });
        if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        sub.planKey = plan.key;
        sub.disabledByAdmin = false;
        sub.activatedByAdmin = false;
        sub.startDate = null;
        sub.endDate = null;
        if (plan.price === 0) {
          // Free plan: active indefinitely, ad-supported.
          sub.status = 'active';
          sub.trialStartDate = null;
          sub.trialEndDate = null;
          sub.startDate = now;
          sub.adsEnabled = plan.showAds !== false;
        } else if (plan.trialDays > 0) {
          sub.status = 'trial';
          sub.trialStartDate = now;
          sub.trialEndDate = new Date(now.getTime() + plan.trialDays * DAY);
          sub.adsEnabled = plan.adsDuringTrial;
        } else {
          // No trial -> user must pay before accessing premium tools.
          sub.status = 'expired';
          sub.trialStartDate = null;
          sub.trialEndDate = null;
          sub.adsEnabled = false;
        }
        break;
      }

      case 'activateMonthly': {
        const planKey = payload.planKey || sub.planKey;
        if (!planKey) return NextResponse.json({ error: 'No plan to activate' }, { status: 400 });
        const plan = await Plan.findOne({ key: planKey });
        if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        const months = Math.max(1, Number(payload.months) || 1);
        sub.planKey = plan.key;
        sub.status = 'active';
        sub.activatedByAdmin = true;
        sub.disabledByAdmin = false;
        sub.startDate = now;
        sub.endDate = new Date(now.getTime() + months * 30 * DAY);
        sub.adsEnabled = false; // paid -> ads blocked
        break;
      }

      case 'disablePlan': {
        sub.disabledByAdmin = true;
        sub.status = 'disabled';
        break;
      }

      case 'enablePlan': {
        sub.disabledByAdmin = false;
        // Recompute a sensible status from remaining dates.
        sub.status = effectiveStatus(
          { ...sub.toObject(), disabledByAdmin: false } as never,
          now
        );
        break;
      }

      case 'setAds': {
        sub.adsEnabled = !!payload.adsEnabled;
        break;
      }

      case 'expire': {
        sub.status = 'expired';
        sub.activatedByAdmin = false;
        sub.adsEnabled = false;
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        effectiveStatus: effectiveStatus(user.subscription as never, now),
      },
    });
  } catch (error) {
    console.error('Admin user PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
