import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const key = process.env.DEEPL_API_KEY;
  const { text, targetLang } = await req.json().catch(() => ({}));
  if (!key) {
    return NextResponse.json({ error: 'SERVICE_NOT_CONFIGURED', service: 'DeepL', env: 'DEEPL_API_KEY' }, { status: 503 });
  }
  if (!text || !targetLang) return NextResponse.json({ error: 'MISSING_PARAMS' }, { status: 400 });
  try {
    const endpoint = key.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': 'DeepL-Auth-Key ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: [text], target_lang: targetLang }),
    });
    if (!res.ok) return NextResponse.json({ error: 'UPSTREAM_ERROR', detail: await res.text() }, { status: 502 });
    const data = await res.json();
    return NextResponse.json({ translation: data?.translations?.[0]?.text ?? '' });
  } catch (e: any) {
    return NextResponse.json({ error: 'INTERNAL', detail: String(e?.message || e) }, { status: 500 });
  }
}