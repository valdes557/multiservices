import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireUser } from '@/lib/apiAuth';
import ForumMessage from '@/models/ForumMessage';
import { resolveForumAccess } from '@/lib/forum';

export const dynamic = 'force-dynamic';

// DELETE /api/forums/:planKey/messages/:id — admin (any) or author (own) soft-delete.
export async function DELETE(request: NextRequest, { params }: { params: { planKey: string; id: string } }) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const access = await resolveForumAccess(guard.user.userId, params.planKey);
    if (!access.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const msg = await ForumMessage.findOne({ _id: params.id, planKey: params.planKey });
    if (!msg) return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });

    const isAuthor = String(msg.userId) === String(access.user._id);
    if (!access.isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
    }

    msg.deleted = true;
    await msg.save();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('forum message DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
