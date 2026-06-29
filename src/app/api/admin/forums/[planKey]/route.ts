import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/apiAuth';
import Plan from '@/models/Plan';
import ForumMessage from '@/models/ForumMessage';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/forums/:planKey — admin forum controls.
 * Body: { action: 'open' | 'close' | 'clear' }
 *  - open/close : toggle whether members can post (requirement #15).
 *  - clear      : soft-delete all messages.
 */
export async function PATCH(request: NextRequest, { params }: { params: { planKey: string } }) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const { action } = await request.json();
    const plan = await Plan.findOne({ key: params.planKey });
    if (!plan) return NextResponse.json({ error: 'Plan introuvable' }, { status: 404 });

    if (action === 'open') { plan.forumOpen = true; await plan.save(); }
    else if (action === 'close') { plan.forumOpen = false; await plan.save(); }
    else if (action === 'clear') { await ForumMessage.updateMany({ planKey: params.planKey, deleted: false }, { deleted: true }); }
    else return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });

    return NextResponse.json({ ok: true, forumOpen: plan.forumOpen });
  } catch (error) {
    console.error('admin forum PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
