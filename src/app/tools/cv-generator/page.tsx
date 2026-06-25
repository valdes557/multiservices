'use client';
type Template = 'modern' | 'ats';

export default function CvGeneratorPage() {
  const [tpl, setTpl] = useState<Template>('modern');
  const [d, setD] = useState({
    name: 'Jean Dupont', title: 'Développeur Web', email: 'jean@email.com', phone: '06 12 34 56 78',
    city: 'Paris', summary: "Développeur passionné avec 5 ans d'expérience en applications web modernes.",
    experience: "Développeur Senior — TechCorp (2021-2024)\nLead Dev sur 3 produits SaaS.\n\nDéveloppeur — WebAgency (2019-2021)\nIntégration et back-end.",
    education: "Master Informatique — Université de Paris (2019)",
    skills: 'React, Next.js, TypeScript, Node.js, MongoDB, Tailwind',
    languages: 'Français (natif), Anglais (courant)',
  });
  const ref = useRef<HTMLDivElement>(null);
  const set = (k: string, v: string) => setD((p) => ({ ...p, [k]: v }));

  async function exportPdf() {
    if (!ref.current) return;
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import('jspdf'), import('html2canvas')]);
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const w = 210; const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save(`cv-${d.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }

  const skills = d.skills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <ToolLayout title="Générateur de CV professionnels" description="Créez un CV moderne ou ATS-friendly avec aperçu en temps réel et export PDF." icon={<IdCard className="h-7 w-7" />} premium>
      <div className="mb-6 flex items-center gap-2">
        <Button variant={tpl === 'modern' ? 'default' : 'outline'} size="sm" onClick={() => setTpl('modern')}>CV moderne</Button>
        <Button variant={tpl === 'ats' ? 'default' : 'outline'} size="sm" onClick={() => setTpl('ats')}>CV ATS-friendly</Button>
        <Button className="ml-auto" size="sm" onClick={exportPdf}><Download className="mr-2 h-4 w-4" /> Exporter PDF</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:max-h-[80vh] lg:overflow-auto">
          <CardHeader><CardTitle>Vos informations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[['name','Nom complet'],['title','Titre / Poste'],['email','Email'],['phone','Téléphone'],['city','Ville']].map(([k,l]) => (
              <div key={k} className="space-y-1.5"><Label>{l}</Label><Input value={(d as any)[k]} onChange={(e) => set(k, e.target.value)} /></div>
            ))}
            {[['summary','Résumé'],['experience','Expériences'],['education','Formation'],['skills','Compétences (séparées par virgules)'],['languages','Langues']].map(([k,l]) => (
              <div key={k} className="space-y-1.5"><Label>{l}</Label><Textarea rows={k==='experience'?5:2} value={(d as any)[k]} onChange={(e) => set(k, e.target.value)} /></div>
            ))}
          </CardContent>
        </Card>

        <div>
          <div ref={ref} className="rounded-lg bg-white p-8 text-gray-900 shadow-lg" style={{ minHeight: 600 }}>
            {tpl === 'modern' ? (
              <div>
                <div className="border-b-4 border-blue-600 pb-3">
                  <h2 className="text-3xl font-bold text-blue-700">{d.name}</h2>
                  <p className="text-lg text-gray-600">{d.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{d.email} · {d.phone} · {d.city}</p>
                </div>
                <Section t="Profil">{d.summary}</Section>
                <Section t="Expérience" pre>{d.experience}</Section>
                <Section t="Formation" pre>{d.education}</Section>
                <div className="mt-4"><h3 className="font-bold text-blue-700">Compétences</h3>
                  <div className="mt-2 flex flex-wrap gap-2">{skills.map((s) => <span key={s} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{s}</span>)}</div></div>
                <Section t="Langues">{d.languages}</Section>
              </div>
            ) : (
              <div className="font-serif">
                <h2 className="text-2xl font-bold uppercase">{d.name}</h2>
                <p>{d.title}</p>
                <p className="text-sm">{d.email} | {d.phone} | {d.city}</p>
                <hr className="my-3" />
                <AtsSection t="RÉSUMÉ">{d.summary}</AtsSection>
                <AtsSection t="EXPÉRIENCE PROFESSIONNELLE" pre>{d.experience}</AtsSection>
                <AtsSection t="FORMATION" pre>{d.education}</AtsSection>
                <AtsSection t="COMPÉTENCES">{d.skills}</AtsSection>
                <AtsSection t="LANGUES">{d.languages}</AtsSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function Section({ t, children, pre }: { t: string; children: React.ReactNode; pre?: boolean }) {
  return (<div className="mt-4"><h3 className="font-bold text-blue-700">{t}</h3><p className={`mt-1 text-sm text-gray-700 ${pre ? 'whitespace-pre-wrap' : ''}`}>{children}</p></div>);
}
function AtsSection({ t, children, pre }: { t: string; children: React.ReactNode; pre?: boolean }) {
  return (<div className="mt-3"><h3 className="font-bold">{t}</h3><p className={`text-sm ${pre ? 'whitespace-pre-wrap' : ''}`}>{children}</p></div>);
}
