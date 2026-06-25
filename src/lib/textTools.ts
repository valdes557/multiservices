export type TextMode = 'spelling' | 'grammar' | 'reformulate' | 'simplify' | 'formal' | 'persuasive';

const spellingFixes: [RegExp, string][] = [
  [/\bca\b/g, 'ça'], [/\boe\b/g, 'œ'], [/\bdonc je\b/gi, 'donc je'],
  [/\s+,/g, ','], [/\s+\./g, '.'], [/\s{2,}/g, ' '],
  [/([!?:;])(?=\S)/g, '$1 '], [/\bmalgres\b/gi, 'malgré'], [/\bparmis\b/gi, 'parmi'],
  [/\bvas-y\b/gi, 'vas-y'], [/\bquelque soit\b/gi, 'quel que soit'],
];
const grammarFixes: [RegExp, string][] = [
  [/\bje vais aller\b/gi, 'je vais'], [/\bau jour d'aujourd'hui\b/gi, "aujourd'hui"],
  [/\bvoir même\b/gi, 'voire même'], [/\bcomme même\b/gi, 'quand même'],
];
const formalMap: [RegExp, string][] = [
  [/\bsalut\b/gi, 'Bonjour'], [/\bcoucou\b/gi, 'Bonjour'], [/\bok\b/gi, "d'accord"],
  [/\bça va\b/gi, 'tout se passe bien'], [/\bje veux\b/gi, 'je souhaiterais'],
  [/\bje pense que\b/gi, "j'estime que"], [/\bbeaucoup de\b/gi, 'de nombreux'],
  [/\bdu coup\b/gi, 'par conséquent'], [/\bun truc\b/gi, 'un élément'],
];
const persuasivePrefix = ['Sans aucun doute, ', 'Il est essentiel de souligner que ', 'De manière convaincante, '];

function applyAll(text: string, rules: [RegExp, string][]) {
  return rules.reduce((acc, [re, rep]) => acc.replace(re, rep), text);
}
function capitalizeSentences(text: string) {
  return text.replace(/(^|[.!?]\s+)([a-zà-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export function transformText(text: string, mode: TextMode): string {
  if (!text.trim()) return '';
  switch (mode) {
    case 'spelling': return capitalizeSentences(applyAll(text, spellingFixes));
    case 'grammar': return capitalizeSentences(applyAll(applyAll(text, spellingFixes), grammarFixes));
    case 'formal': return capitalizeSentences(applyAll(applyAll(text, spellingFixes), formalMap));
    case 'simplify':
      return capitalizeSentences(text.replace(/,\s*(c'est-à-dire|à savoir)[^.]*/gi, '').replace(/\b(afin de|dans le but de)\b/gi, 'pour').replace(/\b(néanmoins|toutefois)\b/gi, 'mais').replace(/\s{2,}/g, ' '));
    case 'persuasive': {
      const fixed = capitalizeSentences(applyAll(text, spellingFixes));
      const pref = persuasivePrefix[Math.floor(Math.random() * persuasivePrefix.length)];
      return fixed.split(/(?<=[.!?])\s+/).map((s, i) => (i === 0 && s ? pref + s.charAt(0).toLowerCase() + s.slice(1) : s)).join(' ');
    }
    case 'reformulate':
    default:
      return capitalizeSentences(applyAll(applyAll(text, spellingFixes), formalMap).replace(/\b(et puis|et ensuite)\b/gi, 'puis').replace(/\bvraiment\b/gi, 'particulièrement'));
  }
}

export const modeLabels: Record<TextMode, string> = {
  spelling: 'Correction orthographique',
  grammar: 'Correction grammaticale',
  reformulate: 'Reformulation professionnelle',
  simplify: 'Simplification',
  formal: 'Version formelle',
  persuasive: 'Version persuasive',
};
