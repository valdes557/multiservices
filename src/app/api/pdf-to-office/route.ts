import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const key = process.env.CLOUDCONVERT_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'SERVICE_NOT_CONFIGURED', service: 'CloudConvert', env: 'CLOUDCONVERT_API_KEY' }, { status: 503 });
  }
  // Le flux complet CloudConvert (upload -> convert -> export) se branche ici une fois la clé fournie.
  return NextResponse.json({ error: 'NOT_IMPLEMENTED', hint: 'Cle detectee. Branchez le flux CloudConvert (jobs API).' }, { status: 501 });
}