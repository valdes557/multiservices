'use client';
import { useState } from 'react';
import { FileSpreadsheet, Plus, Trash2, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/context/LocaleContext';
import { jsPDF } from 'jspdf';

type Item = { id: number; desc: string; qty: string; price: string };
export default function InvoiceGeneratorPage() {
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [number, setNumber] = useState('2026-001');
  const [vat, setVat] = useState(20);
  const [items, setItems] = useState<Item[]>([{ id: 1, desc: fr ? 'Prestation' : 'Service', qty: '1', price: '100' }]);

  const add = () => setItems((i) => [...i, { id: Date.now(), desc: '', qty: '1', price: '0' }]);
  const remove = (id: number) => setItems((i) => i.filter((x) => x.id !== id));
  const upd = (id: number, k: keyof Item, v: string) => setItems((i) => i.map((x) => x.id === id ? { ...x, [k]: v } : x));

  const ht = items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0), 0);
  const tva = ht * vat / 100;
  const ttc = ht + tva;
  const fmt = (x: number) => x.toFixed(2);

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text((fr ? 'FACTURE' : 'INVOICE') + ' N° ' + number, 14, 20);
    doc.setFontSize(10);
    doc.text((fr ? 'De: ' : 'From: ') + from, 14, 32);
    doc.text((fr ? 'À: ' : 'To: ') + to, 14, 38);
    let y = 52;
    doc.setFont('helvetica', 'bold');
    doc.text(fr ? 'Description' : 'Description', 14, y); doc.text('Qté', 120, y); doc.text(fr ? 'P.U.' : 'Price', 145, y); doc.text('Total', 175, y);
    doc.setFont('helvetica', 'normal'); y += 8;
    items.forEach((it) => {
      const tot = (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0);
      doc.text(String(it.desc).slice(0, 50), 14, y); doc.text(String(it.qty), 120, y); doc.text(fmt(parseFloat(it.price) || 0), 145, y); doc.text(fmt(tot), 175, y); y += 7;
    });
    y += 6;
    doc.text((fr ? 'Total HT: ' : 'Net: ') + fmt(ht) + ' EUR', 130, y); y += 6;
    doc.text('TVA (' + vat + '%): ' + fmt(tva) + ' EUR', 130, y); y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text((fr ? 'Total TTC: ' : 'Total: ') + fmt(ttc) + ' EUR', 130, y);
    doc.save('facture-' + number + '.pdf');
  }

  return (
    <ToolLayout title={fr ? "Générateur de factures" : "Invoice Generator"} description={fr ? "Créez des factures professionnelles avec lignes, TVA et total, exportables en PDF." : "Create professional invoices with line items, VAT and total, exportable to PDF."} icon={<FileSpreadsheet className="h-6 w-6" />}>
      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><Label>{fr ? 'Émetteur' : 'From'}</Label><Input value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><Label>{fr ? 'Client' : 'To'}</Label><Input value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <div><Label>{fr ? 'N° facture' : 'Invoice #'}</Label><Input value={number} onChange={(e) => setNumber(e.target.value)} /></div>
        </div>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-[1fr_70px_90px_40px] gap-2 items-center">
              <Input placeholder={fr ? 'Description' : 'Description'} value={it.desc} onChange={(e) => upd(it.id, 'desc', e.target.value)} />
              <Input type="number" value={it.qty} onChange={(e) => upd(it.id, 'qty', e.target.value)} />
              <Input type="number" value={it.price} onChange={(e) => upd(it.id, 'price', e.target.value)} />
              <Button variant="ghost" size="icon" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4" /> {fr ? 'Ligne' : 'Line'}</Button>
            <Label className="ml-auto">TVA %</Label>
            <Input type="number" value={vat} onChange={(e) => setVat(Number(e.target.value))} className="w-20" />
          </div>
        </div>
        <div className="rounded-lg border p-4 space-y-1 text-right">
          <p className="text-sm">{fr ? 'Total HT' : 'Net'}: <span className="font-semibold">{fmt(ht)} €</span></p>
          <p className="text-sm">TVA: <span className="font-semibold">{fmt(tva)} €</span></p>
          <p className="text-lg font-bold text-primary">{fr ? 'Total TTC' : 'Total'}: {fmt(ttc)} €</p>
        </div>
        <Button onClick={exportPdf}><Download className="h-4 w-4" /> {fr ? 'Exporter en PDF' : 'Export PDF'}</Button>
      </CardContent></Card>
    </ToolLayout>
  );
}