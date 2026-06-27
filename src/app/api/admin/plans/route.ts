import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';
import { requireAdmin } from '@/lib/apiAuth';

// GET /api/admin/plans — list every plan (active or not).
export async function GET(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const plans = await Plan.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Admin plans GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/plans — create a new plan.
export async function POST(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const body = await request.json();

    const key = String(body.key || '').trim().toLowerCase();
    if (!key) {
      return NextResponse.json({ error: 'A plan key is required' }, { status: 400 });
    }
    if (!/^[a-z0-9-]+$/.test(key)) {
      return NextResponse.json({ error: 'Key may only contain lowercase letters, numbers and hyphens' }, { status: 400 });
    }

    const existing = await Plan.findOne({ key });
    if (existing) {
      return NextResponse.json({ error: 'A plan with this key already exists' }, { status: 409 });
    }

    const plan = await Plan.create({
      key,
      name: body.name ?? { fr: key, en: key },
      description: body.description ?? { fr: '', en: '' },
      price: Number(body.price) || 0,
      currency: body.currency || 'XOF',
      trialDays: Math.max(0, Number(body.trialDays) || 0),
      features: Array.isArray(body.features) ? body.features : [],
      limits: body.limits && typeof body.limits === 'object' ? body.limits : {},
      adsDuringTrial: body.adsDuringTrial !== false,
      forumEnabled: body.forumEnabled !== false,
      active: body.active !== false,
      order: Number(body.order) || 0,
      isSystem: false,
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Admin plans POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
