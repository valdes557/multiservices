import * as React from 'react';
import { Coins, FileText, SpellCheck, Landmark, Ruler, TrendingUp, User, Image as ImageIcon, Braces, FileCode, Binary, Fingerprint, KeyRound, Key, Map, Bot, Code2, QrCode, Palette, PiggyBank, Receipt, Percent, Calculator, FileSpreadsheet, FileCheck, GraduationCap, ArrowLeftRight, Target, FileImage, Maximize2, Stamp, Crop, type LucideProps } from 'lucide-react';

const map: Record<string, React.ComponentType<LucideProps>> = {
  Coins, FileText, SpellCheck, Landmark, Ruler, TrendingUp, User, Image: ImageIcon,
  Braces, FileCode, Binary, Fingerprint, KeyRound, Key,
  Map, Bot, Code2, QrCode, Palette,
  PiggyBank, Receipt, Percent, Calculator,
  FileSpreadsheet, FileCheck, GraduationCap, ArrowLeftRight, Target,
  FileImage, Maximize2, Stamp, Crop,
};
export function ToolIcon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name] || FileText;
  return <C {...props} />;
}