'use client';
export default function UnitConverterPage() {
  const [catId, setCatId] = useState(categories[0].id);
  const cat = categories.find((c) => c.id === catId)!;
  const [from, setFrom] = useState(cat.units[0].id);
  const [to, setTo] = useState(cat.units[1].id);
  const [value, setValue] = useState('1');

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return '';
    const r = convert(catId, from, to, v);
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 6 }).format(r);
  }, [catId, from, to, value]);

  function selectCat(id: string) {
    const c = categories.find((x) => x.id === id)!;
    setCatId(id); setFrom(c.units[0].id); setTo(c.units[1]?.id || c.units[0].id);
  }
  function swap() { setFrom(to); setTo(from); }

  return (
    <ToolLayout title="Convertisseur universel" description="Convertissez instantanément entre 10 catégories d'unités." icon={<Ruler className="h-7 w-7" />}>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c.id} onClick={() => selectCat(c.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${catId === c.id ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>De</Label>
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {cat.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
              <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="text-lg" />
            </div>
            <Button variant="outline" size="icon" onClick={swap} className="mb-0.5"><ArrowRightLeft className="h-4 w-4" /></Button>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Vers</Label>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {cat.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
              <div className="flex h-10 items-center rounded-md border bg-primary/5 px-3 text-lg font-bold text-primary">{result || '—'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
