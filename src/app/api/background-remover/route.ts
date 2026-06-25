import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const key = process.env.REMOVE_BG_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'SERVICE_NOT_CONFIGURED', service: 'remove.bg', env: 'REMOVE_BG_API_KEY' }, { status: 503 });
  }
  try {
    const form = await req.formData();
    const file = form.get('image') as File | null;
    if (!file) return NextResponse.json({ error: 'NO_FILE' }, { status: 400 });
    const upstream = new FormData();
    upstream.append('image_file', file);
    upstream.append('size', 'auto');
    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': key },
      body: upstream,
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: 'UPSTREAM_ERROR', detail: txt }, { status: 502 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return new NextResponse(buf, { headers: { 'Content-Type': 'image/png' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'INTERNAL', detail: String(e?.message || e) }, { status: 500 });
  }
}