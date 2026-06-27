import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getSettings } from '@/models/Settings';

// Always read live settings (never statically cache this route).
export const dynamic = 'force-dynamic';

// GET /api/settings/public — public AdSense flags used by the client to render ads.
export async function GET() {
  try {
    await dbConnect();
    const s = await getSettings();
    return NextResponse.json({
      adsenseApproved: s.adsenseApproved,
      adsenseClientId: s.adsenseClientId,
      adsenseSlotId: s.adsenseSlotId,
    });
  } catch (error) {
    console.error('Public settings GET error:', error);
    // Fail safe: no ads if settings can't be read.
    return NextResponse.json({ adsenseApproved: false, adsenseClientId: '', adsenseSlotId: '' });
  }
}
