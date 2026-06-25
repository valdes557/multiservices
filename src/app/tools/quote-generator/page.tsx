'use client';
import { useState } from 'react';
import { FileCheck, Plus, Trash2, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';
import { jsPDF } from 'jspdf';

type Item = { id: number; desc: string; qty: string; price: string };
export default function QuoteGeneratorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [company, setCompany] = useState('');
  const [client, setClient] = useState('');
  const [validity, setValidity] = useState('30');
  const [items, setItems] = useState<Item[]>([{ id: 1, desc: fr ? 'Prestation' : 'Service', qty: '1', price: '100' }]);

  const add = () => setItems((i) => [...i, { id: Date.now(), desc: '', qty: '1', price: '0' }]);
  const remove = (id: number) => setItems((i) => i.filter((x) => x.id !== id));
  const upd = (id: number, k: keyof Item, v: string) => setItems((i) => i.map((x) => x.id === id ? { ...x, [k]: v } : x));

  const total = items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0), 0);
  const fmt = (x: number) => x.toFixed(2);

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text(fr ? 'DEVIS' : 'QUOTE', 14, 20);
    doc.setFontSize(10);
    doc.text((fr ? 'Entreprise: ' : 'Company: ') + company, 14, 32);
    doc.text((fr ? 'Client: ' : 'Client: ') + client, 14, 38);
    doc.text((fr ? 'Valable: ' : 'Valid for: ') + validity + (fr ? ' jours' : ' days'), 14, 44);
    let y = 58;
    doc.setFont('helvetica', 'bold');
    doc.text(fr ? 'Prestation' : 'Service', 14, y); doc.text(fr ? 'Qté' : 'Qty', 120, y); doc.text(fr ? 'P.U.' : 'Price', 145, y); doc.text('Total', 175, y);
    doc.setFont('helvetica', 'normal'); y += 8;
    items.forEach((it) => {
      const tot = (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0);
      doc.text(String(it.desc).slice(0, 50), 14, y); doc.text(String(it.qty), 120, y); doc.text(fmt(parseFloat(it.price) || 0), 145, y); doc.text(fmt(tot), 175, y); y += 7;
    });
    y += 8; doc.setFont('helvetica', 'bold');
    doc.text((fr ? 'Total: ' : 'Total: ') + fmt(total) + ' EUR', 130, y);
    doc.save('devis.pdf');
  }

  return (
    <ToolLayout title={fr ? "Générateur de devis" : "Quote Generator"} description={fr ? "Générez des devis clairs avec prestations, montants et validité, prêts à envoyer." : "Generate clear quotes with services, amounts and validity, ready to send."} icon={<FileCheck className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><Label>{fr ? 'Entreprise' : 'Company'}</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          <div><Label>{fr ? 'Client' : 'Client'}</Label><Input value={client} onChange={(e) => setClient(e.target.value)} /></div>
          <div><Label>{fr ? 'Validité (jours)' : 'Validity (days)'}</Label><Input type="number" value={validity} onChange={(e) => setValidity(e.target.value)} /></div>
        </div>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-[1fr_70px_90px_40px] gap-2 items-center">
              <Input placeholder={fr ? 'Prestation' : 'Service'} value={it.desc} onChange={(e) => upd(it.id, 'desc', e.target.value)} />
              <Input type="number" value={it.qty} onChange={(e) => upd(it.id, 'qty', e.target.value)} />
              <Input type="number" value={it.price} onChange={(e) => upd(it.id, 'price', e.target.value)} />
              <Button variant="ghost" size="icon" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4" /> {fr ? 'Prestation' : 'Service'}</Button>
        </div>
        <div className="rounded-lg border p-4 text-right">
          <p className="text-lg font-bold text-primary">{fr ? 'Total' : 'Total'}: {fmt(total)} €</p>
        </div>
        <Button onClick={exportPdf}><Download className="h-4 w-4" /> {fr ? 'Exporter en PDF' : 'Export PDF'}</Button>
      </CardContent></Card>
    </ToolLayout>
  );
}