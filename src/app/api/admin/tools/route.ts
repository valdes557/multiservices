import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tool from '@/models/Tool';
import { requireAdmin } from '@/lib/apiAuth';

// GET /api/admin/tools — list every tool.
export async function GET(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const tools = await Tool.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Admin tools GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/tools — create a new tool.
export async function POST(request: NextRequest) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const body = await request.json();

    const key = String(body.key || '').trim().toLowerCase();
    if (!key) return NextResponse.json({ error: 'A tool key is required' }, { status: 400 });
    if (!/^[a-z0-9-]+$/.test(key)) {
      return NextResponse.json({ error: 'Key may only contain lowercase letters, numbers and hyphens' }, { status: 400 });
    }
    if (!body.category) return NextResponse.json({ error: 'A category is required' }, { status: 400 });

    const existing = await Tool.findOne({ key });
    if (existing) return NextResponse.json({ error: 'A tool with this key already exists' }, { status: 409 });

    const tool = await Tool.create({
      key,
      name: body.name ?? { fr: key, en: key },
      description: body.description ?? { fr: '', en: '' },
      category: body.category,
      href: body.href || '',
      icon: body.icon || 'Wrench',
      planKeys: Array.isArray(body.planKeys) ? body.planKeys : [],
      isPremium: body.isPremium !== false,
      active: body.active !== false,
      order: Number(body.order) || 0,
    });

    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    console.error('Admin tools POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
