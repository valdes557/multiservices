import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getSettings } from '@/models/Settings';
import { requireAdmin } from '@/lib/apiAuth';

// GET /api/admin/settings — full settings (admin).
export async function GET(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const s = await getSettings();
    return NextResponse.json({ settings: s });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings — update AdSense configuration.
export async function PUT(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;
  try {
    await dbConnect();
    const body = await request.json();
    const s = await getSettings();
    if (body.adsenseApproved !== undefined) s.adsenseApproved = !!body.adsenseApproved;
    if (body.adsenseClientId !== undefined) s.adsenseClientId = String(body.adsenseClientId).trim();
    if (body.adsenseSlotId !== undefined) s.adsenseSlotId = String(body.adsenseSlotId).trim();
    await s.save();
    return NextResponse.json({ settings: s });
  } catch (error) {
    console.error('Admin settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
