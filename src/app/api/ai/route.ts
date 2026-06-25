import { NextRequest, NextResponse } from 'next/server';
import { runLocal, aiPrompts, AiTask } from '@/lib/aiTools';

export async function POST(req: NextRequest) {
  try {
    const { task, input, opts } = await req.json();
    if (!task || !(task in aiPrompts)) {
      return NextResponse.json({ error: 'Invalid task' }, { status: 400 });
    }
    const key = process.env.OPENAI_API_KEY;
    if (key) {
      try {
        const prompt = aiPrompts[task as AiTask] + (opts ? ' (' + JSON.stringify(opts) + ')' : '') + ':\n\n' + (input || '');
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un assistant de rédaction expert, bilingue français/anglais. Réponds uniquement avec le contenu demandé, sans préambule.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const out = data?.choices?.[0]?.message?.content?.trim();
          if (out) return NextResponse.json({ output: out, engine: 'ai' });
        }
      } catch {
        // tombe sur le fallback local
      }
    }
    const output = runLocal(task as AiTask, input || '', opts || {});
    return NextResponse.json({ output, engine: 'local' });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}