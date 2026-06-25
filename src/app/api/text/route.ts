export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    // Si une clé IA est configurée, on délègue à l'IA pour une qualité supérieure
    if (apiKey) {
      const prompts: Record<string, string> = {
        spelling: 'Corrige uniquement les fautes d\'orthographe',
        grammar: 'Corrige l\'orthographe et la grammaire',
        reformulate: 'Reformule de façon professionnelle',
        simplify: 'Simplifie le texte',
        formal: 'Réécris dans un registre formel',
        persuasive: 'Réécris de façon persuasive',
      };
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un correcteur et rédacteur francophone. Réponds uniquement avec le texte transformé.' },
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
    // Fallback local déterministe
    return NextResponse.json({ result: transformText(text || '', (mode || 'reformulate') as TextMode), engine: 'local' });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur de traitement' }, { status: 500 });
  }
}
