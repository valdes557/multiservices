import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireUser } from '@/lib/apiAuth';
import ForumMessage, { type IForumMessage } from '@/models/ForumMessage';
import { resolveForumAccess } from '@/lib/forum';

export const dynamic = 'force-dynamic';

const MAX_ATTACHMENT = 3_500_000; // ~2.6 MB as base64 data URL

function serialize(m: IForumMessage) {
  return {
    id: String(m._id),
    userId: String(m.userId),
    authorName: m.authorName,
    type: m.type,
    content: m.deleted ? '' : m.content,
    attachmentUrl: m.deleted ? '' : m.attachmentUrl,
    deleted: m.deleted,
    createdAt: m.createdAt,
  };
}

// GET /api/forums/:planKey/messages?since=ISO — poll messages (members + admin).
export async function GET(request: NextRequest, { params }: { params: { planKey: string } }) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const access = await resolveForumAccess(guard.user.userId, params.planKey);
    if (!access.canRead) {
      return NextResponse.json({ error: 'Accès au forum refusé', reason: access.reason }, { status: 403 });
    }
    const since = request.nextUrl.searchParams.get('since');
    const q: Record<string, unknown> = { planKey: params.planKey };
    if (since) q.createdAt = { $gt: new Date(since) };
    const msgs = await ForumMessage.find(q).sort({ createdAt: 1 }).limit(200);
    return NextResponse.json({
      messages: msgs.map(serialize),
      forumOpen: access.plan?.forumOpen !== false,
      isAdmin: access.isAdmin,
    });
  } catch (error) {
    console.error('forum messages GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/forums/:planKey/messages — send a message (text/image/voice).
export async function POST(request: NextRequest, { params }: { params: { planKey: string } }) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const access = await resolveForumAccess(guard.user.userId, params.planKey);
    if (!access.canRead) return NextResponse.json({ error: 'Accès au forum refusé', reason: access.reason }, { status: 403 });
    if (!access.canPost) return NextResponse.json({ error: 'Le forum est fermé par l’administrateur' }, { status: 403 });

    const { type, content, attachmentUrl } = await request.json();
    const t = type === 'image' || type === 'voice' ? type : 'text';

    if (t === 'text') {
      if (!content || !String(content).trim()) return NextResponse.json({ error: 'Message vide' }, { status: 400 });
    } else {
      if (!attachmentUrl || typeof attachmentUrl !== 'string' || !attachmentUrl.startsWith('data:')) {
        return NextResponse.json({ error: 'Pièce jointe invalide' }, { status: 400 });
      }
      if (attachmentUrl.length > MAX_ATTACHMENT) {
        return NextResponse.json({ error: 'Fichier trop volumineux (max ~2.5 Mo)' }, { status: 413 });
      }
    }

    const msg = await ForumMessage.create({
      planKey: params.planKey,
      userId: access.user!._id,
      authorName: access.user!.name,
      type: t,
      content: String(content || '').slice(0, 4000),
      attachmentUrl: t === 'text' ? '' : attachmentUrl,
    });

    return NextResponse.json({ message: serialize(msg) }, { status: 201 });
  } catch (error) {
    console.error('forum messages POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
