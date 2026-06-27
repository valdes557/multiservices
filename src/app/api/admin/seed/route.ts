import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/apiAuth';
import { seedDefaults } from '@/lib/seed';

// POST /api/admin/seed — insert the default plans & tools if missing (idempotent).
export async function POST(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const result = await seedDefaults();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
