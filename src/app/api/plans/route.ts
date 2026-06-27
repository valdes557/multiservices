import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';

// GET /api/plans — public list of active plans (for the pricing page).
export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({ active: true }).sort({ order: 1, price: 1 }).lean();
    return NextResponse.json({
      plans: plans.map((p) => ({
        id: String(p._id),
        key: p.key,
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        trialDays: p.trialDays,
        features: p.features,
        forumEnabled: p.forumEnabled,
      })),
    });
  } catch (error) {
    console.error('Public plans GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
