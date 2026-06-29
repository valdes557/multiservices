import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/apiAuth';
import { getSettings, adminSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

// GET /api/admin/settings — full settings (secrets masked).
export async function GET(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const s = await getSettings();
    return NextResponse.json({ settings: adminSettings(s) });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/settings — update AdSense / general settings.
 * Body (all optional): { adsenseApproved, adsenseClientId, adsenseSlotTrial,
 *   sebpay: { mode, baseUrl, country, operators } }
 *
 * Editing SebPay SECRET keys is NOT done here — it requires the email
 * confirmation flow in /api/admin/payment-config (Phase C).
 */
export async function PUT(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const body = await request.json();
    const s = await getSettings();

    if (typeof body.adsenseApproved === 'boolean') s.adsenseApproved = body.adsenseApproved;
    if (typeof body.adsenseClientId === 'string') s.adsenseClientId = body.adsenseClientId.trim();
    if (typeof body.adsenseSlotTrial === 'string') s.adsenseSlotTrial = body.adsenseSlotTrial.trim();

    if (body.sebpay && typeof body.sebpay === 'object') {
      const sp = body.sebpay;
      if (sp.mode === 'test' || sp.mode === 'live') s.sebpay.mode = sp.mode;
      if (typeof sp.baseUrl === 'string' && sp.baseUrl.trim()) s.sebpay.baseUrl = sp.baseUrl.trim();
      if (typeof sp.country === 'string' && sp.country.trim()) s.sebpay.country = sp.country.trim().toUpperCase();
      if (Array.isArray(sp.operators)) s.sebpay.operators = sp.operators.map((o: string) => String(o).toLowerCase());
    }

    await s.save();
    return NextResponse.json({ settings: adminSettings(s) });
  } catch (error) {
    console.error('Admin settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
