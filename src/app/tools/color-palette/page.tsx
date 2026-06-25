'use client';
import { useState } from 'react';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

function hslToHex(h: number, s: number, l: number) {
  l /= 100; const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12; const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return '#' + f(0) + f(8) + f(4);
}

export default function ColorPalettePage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [base, setBase] = useState('#3b82f6');
  const [scheme, setScheme] = useState('analogous');
  const [copied, setCopied] = useState('');

  function hexToHsl(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    return [h, s * 100, l * 100] as [number, number, number];
  }

  const [h, s, l] = hexToHsl(base);
  let palette: string[] = [];
  if (scheme === 'analogous') palette = [-30, -15, 0, 15, 30].map((d) => hslToHex((h + d + 360) % 360, s, l));
  else if (scheme === 'complementary') palette = [0, 180].flatMap((d) => [hslToHex((h + d) % 360, s, Math.max(20, l - 15)), hslToHex((h + d) % 360, s, l), hslToHex((h + d) % 360, s, Math.min(85, l + 15))]).slice(0, 5);
  else if (scheme === 'triadic') palette = [0, 120, 240, 60, 180].map((d) => hslToHex((h + d) % 360, s, l));
  else palette = [80, 60, 50, 40, 25].map((ll) => hslToHex(h, s, ll));

  function copy(c: string) { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(''), 1200); }

  return (
    <ToolLayout title={fr ? "Generateur de palettes de couleurs" : "Color Palette Generator"} description={fr ? "Generez des palettes harmonieuses, copiez les codes HEX et exportez vos couleurs." : "Generate harmonious palettes, copy HEX codes and export your colors."} icon={<Palette className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>{fr ? 'Couleur de base' : 'Base color'}</Label><Input type="color" value={base} onChange={(e) => setBase(e.target.value)} /></div>
          <div><Label>{fr ? 'Harmonie' : 'Scheme'}</Label>
            <select value={scheme} onChange={(e) => setScheme(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="analogous">{fr ? 'Analogue' : 'Analogous'}</option>
              <option value="complementary">{fr ? 'Complémentaire' : 'Complementary'}</option>
              <option value="triadic">{fr ? 'Triadique' : 'Triadic'}</option>
              <option value="monochrome">Monochrome</option>
            </select></div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {palette.map((c, i) => (
            <button key={i} onClick={() => copy(c)} className="group flex flex-col items-center gap-1">
              <span className="h-20 w-full rounded-md border" style={{ backgroundColor: c }} />
              <span className="flex items-center gap-1 font-mono text-xs uppercase">{copied === c ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />}{c}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{fr ? 'Cliquez sur une couleur pour copier son code HEX.' : 'Click a color to copy its HEX code.'}</p>
      </CardContent></Card>
    </ToolLayout>
  );
}