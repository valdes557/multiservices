const map: Record<string, React.ComponentType<LucideProps>> = {
  Coins, FileText, SpellCheck, Landmark, Ruler, TrendingUp, IdCard, Image: ImageIcon,
};
export function ToolIcon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name] || FileText;
  return <C {...props} />;
}
