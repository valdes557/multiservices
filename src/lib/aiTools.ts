export type AiTask =
  | 'summarize' | 'rephrase' | 'grammar' | 'email'
  | 'product' | 'social' | 'youtube' | 'hashtags';

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}
function keywords(text: string, n: number): string[] {
  const stop = new Set(['le','la','les','un','une','des','de','du','et','ou','a','à','en','que','qui','dans','pour','sur','avec','the','a','an','of','and','or','to','in','for','on','with','is','are']);
  const freq: Record<string, number> = {};
  text.toLowerCase().replace(/[^a-zà-ÿ0-9\s]/gi, ' ').split(/\s+/).forEach((w) => {
    if (w.length > 3 && !stop.has(w)) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, n).map(([w]) => w);
}
function titleCase(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export function runLocal(task: AiTask, input: string, opts: Record<string, string> = {}): string {
  const text = (input || '').trim();
  if (!text && task !== 'email' && task !== 'product') return '';
  switch (task) {
    case 'summarize': {
      const sents = sentences(text);
      if (sents.length <= 2) return text;
      const kw = keywords(text, 8);
      const scored = sents.map((s) => ({ s, score: kw.reduce((a, k) => a + (s.toLowerCase().includes(k) ? 1 : 0), 0) }));
      const top = scored.sort((a, b) => b.score - a.score).slice(0, Math.max(2, Math.ceil(sents.length * 0.3)));
      const ordered = sents.filter((s) => top.find((t) => t.s === s));
      return ordered.join(' ');
    }
    case 'rephrase': {
      const map: [RegExp, string][] = [
        [/\bvraiment\b/gi, 'particulièrement'], [/\bbeaucoup de\b/gi, 'de nombreux'],
        [/\bdu coup\b/gi, 'par conséquent'], [/\bmais\b/gi, 'cependant'],
        [/\bdonc\b/gi, 'ainsi'], [/\baussi\b/gi, 'également'], [/\btrès\b/gi, 'extrêmement'],
      ];
      return map.reduce((acc, [re, rep]) => acc.replace(re, rep), text);
    }
    case 'grammar': {
      return text.replace(/\s+([,.!?;:])/g, '$1').replace(/([.!?])(?=[A-Za-zÀ-ÿ])/g, '$1 ').replace(/\s{2,}/g, ' ').replace(/(^|[.!?]\s+)([a-zà-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase());
    }
    case 'email': {
      const subject = opts.subject || (text ? text.split('\n')[0].slice(0, 60) : 'Votre demande');
      const tone = opts.tone || 'professionnel';
      const greeting = tone === 'amical' ? 'Bonjour,' : 'Madame, Monsieur,';
      const closing = tone === 'amical' ? 'À très bientôt,' : 'Je vous prie d\'agréer mes salutations distinguées,';
      return greeting + '\n\n' + (text || 'Je me permets de vous contacter au sujet de votre service.') + '\n\n' + closing + '\n[Votre nom]';
    }
    case 'product': {
      const name = opts.name || 'Ce produit';
      const kw = text ? keywords(text, 5) : ['qualité', 'design', 'performance'];
      return titleCase(name) + ' allie ' + kw.slice(0, 3).join(', ') + '. ' +
        'Conçu pour répondre à vos besoins, il offre une expérience remarquable. ' +
        'Points forts :\n• ' + kw.map((k) => titleCase(k)).join('\n• ') + '\n\nCommandez dès maintenant et faites la différence.';
    }
    case 'social': {
      const kw = keywords(text, 5);
      const hooks = ['🚀', '✨', '💡', '🔥'];
      const hook = hooks[Math.floor(Math.random() * hooks.length)];
      const tags = kw.slice(0, 4).map((k) => '#' + k.replace(/[^a-z0-9]/gi, '')).join(' ');
      return hook + ' ' + (sentences(text)[0] || text).slice(0, 180) + '\n\n' + tags;
    }
    case 'youtube': {
      const kw = keywords(text, 4).map(titleCase);
      const base = kw[0] || 'Astuce';
      return [
        base + ' : Le Guide Complet (2026)',
        'Comment ' + (kw[1] || base) + ' en 10 Minutes ⏱️',
        'Top 5 ' + base + ' que Personne ne Connaît 🤯',
        base + ' : Mes Secrets Révélés !',
        'Tu Fais ÇA Mal avec ' + base + ' ? (à éviter)',
      ].join('\n');
    }
    case 'hashtags': {
      const kw = keywords(text, 12);
      return kw.map((k) => '#' + k.replace(/[^a-z0-9]/gi, '')).join(' ');
    }
    default:
      return text;
  }
}

export const aiPrompts: Record<AiTask, string> = {
  summarize: 'Résume ce texte en quelques phrases claires',
  rephrase: 'Reformule ce texte de manière fluide et professionnelle',
  grammar: 'Corrige toutes les fautes d\'orthographe et de grammaire',
  email: 'Rédige un e-mail professionnel à partir de ces informations',
  product: 'Rédige une description produit attrayante et vendeuse',
  social: 'Rédige un post engageant pour les réseaux sociaux avec des hashtags',
  youtube: 'Propose 5 titres YouTube accrocheurs et optimisés',
  hashtags: 'Génère une liste de hashtags pertinents séparés par des espaces',
};
