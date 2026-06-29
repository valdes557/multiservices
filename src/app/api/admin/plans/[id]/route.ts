import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';
import User from '@/models/User';
import { requireAdmin } from '@/lib/apiAuth';
import { getSettings } from '@/lib/settings';

// Fields the admin is allowed to edit on a plan (key is immutable once created).
const EDITABLE = [
  'name', 'description', 'price', 'currency', 'trialDays', 'features',
  'limits', 'adsDuringTrial', 'showAds', 'forumEnabled', 'active', 'order',
] as const;

// PUT /api/admin/plans/:id — update a plan.
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const body = await request.json();
    const plan = await Plan.findById(params.id);
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    // A free plan (price 0) relies on advertising — it can only be activated once
    // AdSense has been approved for the site.
    const willBeFree = (body.price !== undefined ? Number(body.price) || 0 : plan.price) === 0;
    if (body.active === true && willBeFree) {
      const settings = await getSettings();
      if (!settings.adsenseApproved) {
        return NextResponse.json(
          { error: "Le plan gratuit ne peut être activé que lorsque les publicités AdSense sont approuvées (Réglages → AdSense autorisé)." },
          { status: 409 }
        );
      }
    }

    for (const field of EDITABLE) {
      if (body[field] === undefined) continue;
      if (field === 'trialDays') plan.trialDays = Math.max(0, Number(body.trialDays) || 0);
      else if (field === 'price') plan.price = Number(body.price) || 0;
      else if (field === 'order') plan.order = Number(body.order) || 0;
      else (plan as unknown as Record<string, unknown>)[field] = body[field];
    }

    await plan.save();
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Admin plan PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/plans/:id — delete a plan (blocked if users are subscribed).
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const plan = await Plan.findById(params.id);
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    const subscribers = await User.countDocuments({ 'subscription.planKey': plan.key });
    if (subscribers > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${subscribers} user(s) are on this plan. Deactivate it instead.` },
        { status: 409 }
      );
    }

    await plan.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin plan DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
