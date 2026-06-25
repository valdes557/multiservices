'use client';
import { useMemo, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { docTemplates } from '@/lib/documents';

export default function DocumentGeneratorPage() {
  const [tplId, setTplId] = useState(docTemplates[0].id);
  const tpl = docTemplates.find((t) => t.id === tplId)!;
  const [values, setValues] = useState<Record<string, string>>({});
  const doc = useMemo(() => tpl.build(values), [tpl, values]);

  function set(name: string, val: string) { setValues((v) => ({ ...v, [name]: val })); }

  async function exportPdf() {
    const { default: jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11);
    const margin = 20; const width = 210 - margin * 2;
    const lines = pdf.splitTextToSize(doc.body, width);
    let y = margin;
    lines.forEach((line: string) => {
      if (y > 280) { pdf.addPage(); y = margin; }
      pdf.text(line, margin, y); y += 6;
    });
    pdf.save(`${tpl.label.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }

  return (
    <ToolLayout title="Générateur de documents administratifs" description="Choisissez un modèle, remplissez le formulaire et exportez votre document en PDF." icon={<FileText className="h-7 w-7" />}>
      <div className="mb-6 flex flex-wrap gap-2">
        {docTemplates.map((t) => (
          <button key={t.id} onClick={() => { setTplId(t.id); setValues({}); }}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${tplId === t.id ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {tpl.fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label>{f.label}</Label>
                {f.type === 'textarea'
                  ? <Textarea value={values[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} rows={4} />
                  : <Input type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'} value={values[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Aperçu</CardTitle>
            <Button onClick={exportPdf} size="sm"><Download className="mr-2 h-4 w-4" /> Exporter PDF</Button>
          </CardHeader>
          <CardContent>
            <pre className="min-h-[400px] whitespace-pre-wrap rounded-lg border bg-white p-6 font-serif text-sm leading-relaxed text-gray-800">{doc.body}</pre>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}