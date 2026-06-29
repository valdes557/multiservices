import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tool from '@/models/Tool';

// GET /api/tools — public catalogue of active tools (drives the homepage and
// /services listings). `planKeys` is included so the client can show which tools
// the current user's plan grants, and lock the others.
export async function GET() {
  try {
    await dbConnect();
    const tools = await Tool.find({ active: true }).sort({ order: 1 }).lean();
    return NextResponse.json({
      tools: tools.map((t) => ({
        key: t.key,
        name: t.name,
        description: t.description,
        category: t.category,
        href: t.href,
        icon: t.icon,
        planKeys: t.planKeys || [],
        isPremium: t.isPremium,
      })),
    });
  } catch (error) {
    console.error('Public tools GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
