'use client';
import { useState, useEffect } from 'react';
import { KeyRound, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';

export default function PasswordGeneratorPage() {
  const { locale } = useLocale();
  const en = locale === 'en';
  const S = en
    ? { title:'Password Generator', desc:'Create strong, customizable passwords.', length:'Length', upper:'Uppercase', lower:'Lowercase', digits:'Numbers', sym:'Symbols', gen:'Generate', copy:'Copy', copied:'Copied', strength:['Very weak','Weak','Fair','Strong','Very strong'] }
    : { title:'Generateur de mots de passe', desc:'Creez des mots de passe forts et personnalisables.', length:'Longueur', upper:'Majuscules', lower:'Minuscules', digits:'Chiffres', sym:'Symboles', gen:'Generer', copy:'Copier', copied:'Copie', strength:['Tres faible','Faible','Moyen','Fort','Tres fort'] };
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [sym, setSym] = useState(true);
  const [pwd, setPwd] = useState('');
  const [copied, setCopied] = useState(false);
  const gen = () => {
    let set = '';
    if (upper) set += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) set += 'abcdefghijklmnopqrstuvwxyz';
    if (digits) set += '0123456789';
    if (sym) set += '!@#$%^&*()-_=+[]{};:,.<>?';
    if (!set) { setPwd(''); return; }
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    setPwd(Array.from(arr, (n) => set[n % set.length]).join(''));
  };
  useEffect(() => { gen(); }, []);
  const score = (() => { let s = 0; if (pwd.length >= 12) s++; if (pwd.length >= 16) s++; const types = [upper, lower, digits, sym].filter(Boolean).length; if (types >= 3) s++; if (types === 4) s++; return Math.min(4, s); })();
  const copy = () => { navigator.clipboard.writeText(pwd); setCopied(true); setTimeout(()=>setCopied(false),1500); };
  const colors = ['bg-red-500','bg-orange-500','bg-yellow-500','bg-lime-500','bg-green-500'];
  const Toggle = ({ v, set, label }: { v: boolean; set: (b:boolean)=>void; label: string }) => (
    <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={(e)=>set(e.target.checked)} className="h-4 w-4" />{label}</label>
  );
  return (
    <ToolLayout title={S.title} description={S.desc} icon={<KeyRound className="h-7 w-7" />}>
      <Card><CardContent className="space-y-5 p-5">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <span className="flex-1 break-all font-mono text-lg">{pwd || '—'}</span>
          <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
          <Button size="sm" variant="ghost" onClick={gen}><RefreshCw className="h-4 w-4" /></Button>
        </div>
        <div><div className="mb-1 flex justify-between text-xs"><span>{S.strength[score]}</span></div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className={`h-full ${colors[score]}`} style={{ width: `${(score+1)*20}%` }} /></div></div>
        <div className="space-y-1.5"><Label>{S.length}: {len}</Label>
          <input type="range" min={6} max={64} value={len} onChange={(e)=>setLen(+e.target.value)} className="w-full" /></div>
        <div className="grid grid-cols-2 gap-2">
          <Toggle v={upper} set={setUpper} label={S.upper} />
          <Toggle v={lower} set={setLower} label={S.lower} />
          <Toggle v={digits} set={setDigits} label={S.digits} />
          <Toggle v={sym} set={setSym} label={S.sym} />
        </div>
        <Button onClick={gen} className="w-full"><RefreshCw className="mr-2 h-4 w-4" />{S.gen}</Button>
      </CardContent></Card>
    </ToolLayout>
  );
}