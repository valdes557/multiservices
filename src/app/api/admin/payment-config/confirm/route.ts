import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/apiAuth';
import ConfirmationCode from '@/models/ConfirmationCode';
import { getSettings, adminSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/payment-config/confirm
 * Body: { id, code }
 * Validates the one-time code and applies the pending payment-key change.
 */
export async function POST(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const { id, code } = await request.json();
    if (!id || !code) return NextResponse.json({ error: 'id et code requis' }, { status: 400 });

    const doc = await ConfirmationCode.findById(id);
    if (!doc || doc.used || doc.purpose !== 'payment-keys') {
      return NextResponse.json({ error: 'Demande introuvable ou déjà utilisée' }, { status: 404 });
    }
    if (doc.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'Code expiré, recommencez' }, { status: 400 });
    }
    if (doc.attempts >= 5) {
      return NextResponse.json({ error: 'Trop de tentatives, recommencez' }, { status: 429 });
    }
    if (String(code).trim() !== doc.code) {
      doc.attempts += 1;
      await doc.save();
      return NextResponse.json({ error: 'Code incorrect' }, { status: 400 });
    }

    // Apply the pending change.
    const s = await getSettings();
    const p = doc.payload as Record<string, string>;
    if (p.mode === 'test' || p.mode === 'live') s.sebpay.mode = p.mode;
    if (typeof p.baseUrl === 'string' && p.baseUrl) s.sebpay.baseUrl = p.baseUrl;
    if (typeof p.publicKeyTest === 'string') s.sebpay.publicKeyTest = p.publicKeyTest;
    if (typeof p.secretKeyTest === 'string') s.sebpay.secretKeyTest = p.secretKeyTest;
    if (typeof p.publicKeyLive === 'string') s.sebpay.publicKeyLive = p.publicKeyLive;
    if (typeof p.secretKeyLive === 'string') s.sebpay.secretKeyLive = p.secretKeyLive;
    await s.save();

    doc.used = true;
    await doc.save();

    return NextResponse.json({ ok: true, settings: adminSettings(s) });
  } catch (error) {
    console.error('payment-config confirm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
