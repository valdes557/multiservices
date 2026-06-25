import * as React from 'react';
import { Coins, FileText, SpellCheck, Landmark, Ruler, TrendingUp, User, Image as ImageIcon, type LucideProps } from 'lucide-react';

const map: Record<string, React.ComponentType<LucideProps>> = {
  Coins, FileText, SpellCheck, Landmark, Ruler, TrendingUp, User, Image: ImageIcon,
};
export function ToolIcon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name] || FileText;
  return <C {...props} />;
}