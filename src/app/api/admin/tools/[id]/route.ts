import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tool from '@/models/Tool';
import { requireAdmin } from '@/lib/apiAuth';

const EDITABLE = [
  'name', 'description', 'category', 'href', 'icon', 'planKeys', 'isPremium', 'active', 'order',
] as const;

// PUT /api/admin/tools/:id — update a tool (notably its planKeys = tool↔plan mapping).
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const body = await request.json();
    const tool = await Tool.findById(params.id);
    if (!tool) return NextResponse.json({ error: 'Tool not found' }, { status: 404 });

    for (const field of EDITABLE) {
      if (body[field] === undefined) continue;
      if (field === 'order') tool.order = Number(body.order) || 0;
      else if (field === 'planKeys') tool.planKeys = Array.isArray(body.planKeys) ? body.planKeys : [];
      else (tool as unknown as Record<string, unknown>)[field] = body[field];
    }

    await tool.save();
    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Admin tool PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/tools/:id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const tool = await Tool.findByIdAndDelete(params.id);
    if (!tool) return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin tool DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
