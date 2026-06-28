import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getSettings, publicSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

// GET /api/settings — public, non-sensitive flags (AdSense approval, payment availability).
export async function GET() {
  try {
    await dbConnect();
    const s = await getSettings();
    return NextResponse.json({ settings: publicSettings(s) });
  } catch (error) {
    console.error('Settings GET error:', error);
    // Fail safe: ads off, payment unconfigured.
    return NextResponse.json({
      settings: {
        adsenseApproved: false,
        adsenseClientId: '',
        adsenseSlotTrial: '',
        payment: { mode: 'test', country: 'BJ', operators: [], configured: false },
      },
    });
  }
}
