import { NextRequest, NextResponse } from 'next/server';
import { transformText, TextMode } from '@/lib/textTools';

export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const prompts: Record<string, string> = {
        spelling: "Corrige uniquement les fautes d'orthographe",
        grammar: "Corrige l'orthographe et la grammaire",
        reformulate: 'Reformule de facon professionnelle',
        simplify: 'Simplifie le texte',
        formal: 'Reecris dans un registre formel',
        persuasive: 'Reecris de facon persuasive',
      };
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un correcteur francophone. Reponds uniquement avec le texte transforme.' },
            { role: 'user', content: `${prompts[mode] || prompts.reformulate} :\n\n${text}` },
          ],
          temperature: 0.4,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ result: data.choices?.[0]?.message?.content?.trim() || '', engine: 'ai' });
      }
    }
    return NextResponse.json({ result: transformText(text || '', (mode || 'reformulate') as TextMode), engine: 'local' });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur de traitement' }, { status: 500 });
  }
}