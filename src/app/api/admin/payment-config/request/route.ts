import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/apiAuth';
import ConfirmationCode from '@/models/ConfirmationCode';
import { sendEmail, isEmailConfigured, ADMIN_CONFIRM_EMAIL } from '@/lib/email';

export const dynamic = 'force-dynamic';

const ALLOWED = ['mode', 'baseUrl', 'publicKeyTest', 'secretKeyTest', 'publicKeyLive', 'secretKeyLive'] as const;

/**
 * POST /api/admin/payment-config/request
 * Body: { changes: { mode?, baseUrl?, publicKeyTest?, secretKeyTest?, publicKeyLive?, secretKeyLive? } }
 *
 * Starts a sensitive payment-key change: stores the pending change and emails a
 * one-time confirmation code to the owner (valdeslando15@gmail.com). The change
 * is only applied after /confirm. Sending an empty string for a key DELETES it.
 */
export async function POST(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const body = await request.json();
    const raw = body.changes && typeof body.changes === 'object' ? body.changes : {};

    const changes: Record<string, unknown> = {};
    for (const k of ALLOWED) {
      if (k in raw) changes[k] = typeof raw[k] === 'string' ? raw[k].trim() : raw[k];
    }
    if (Object.keys(changes).length === 0) {
      return NextResponse.json({ error: 'Aucune modification fournie' }, { status: 400 });
    }
    if (changes.mode && changes.mode !== 'test' && changes.mode !== 'live') {
      return NextResponse.json({ error: 'mode invalide' }, { status: 400 });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const doc = await ConfirmationCode.create({
      code,
      purpose: 'payment-keys',
      payload: changes,
      email: ADMIN_CONFIRM_EMAIL,
      requestedBy: guard.user.userId,
      expiresAt,
    });

    const fields = Object.keys(changes).join(', ');
    const { sent } = await sendEmail(
      ADMIN_CONFIRM_EMAIL,
      'Code de confirmation — clés de paiement MultiServices',
      `Une modification des clés de paiement a été demandée (${fields}).\n\n` +
        `Votre code de confirmation : ${code}\n\n` +
        `Il expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`
    );

    return NextResponse.json({
      id: String(doc._id),
      sentTo: ADMIN_CONFIRM_EMAIL,
      emailed: sent,
      // In dev (no SMTP), expose the code so the flow can be completed.
      devCode: !isEmailConfigured() ? code : undefined,
    });
  } catch (error) {
    console.error('payment-config request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
