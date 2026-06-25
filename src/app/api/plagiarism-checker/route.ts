import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const key = process.env.PLAGIARISM_API_KEY;
  const endpoint = process.env.PLAGIARISM_API_URL;
  const { text } = await req.json().catch(() => ({}));
  if (!key || !endpoint) {
    return NextResponse.json({ error: 'SERVICE_NOT_CONFIGURED', service: 'Plagiarism API', env: 'PLAGIARISM_API_KEY + PLAGIARISM_API_URL' }, { status: 503 });
  }
  if (!text) return NextResponse.json({ error: 'MISSING_TEXT' }, { status: 400 });
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return NextResponse.json({ error: 'UPSTREAM_ERROR', detail: await res.text() }, { status: 502 });
    return NextResponse.json(await res.json());
  } catch (e: any) {
    return NextResponse.json({ error: 'INTERNAL', detail: String(e?.message || e) }, { status: 500 });
  }
}