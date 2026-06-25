export interface Field { name: string; label: string; type?: 'text' | 'textarea' | 'date' | 'number'; placeholder?: string; }
export interface DocTemplate {
  id: string; label: string;
  fields: Field[];
  build: (v: Record<string, string>) => { title: string; body: string };
}

const today = () => new Date().toLocaleDateString('fr-FR');
const head = (v: Record<string, string>) =>
  `${v.senderName || ''}\n${v.senderAddress || ''}\n${v.senderEmail || ''}\n\n${v.city || ''}, le ${v.date || today()}\n\nÀ : ${v.recipient || ''}\n`;

const common: Field[] = [
  { name: 'senderName', label: 'Votre nom' },
  { name: 'senderAddress', label: 'Votre adresse' },
  { name: 'senderEmail', label: 'Votre email' },
  { name: 'city', label: 'Ville' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'recipient', label: 'Destinataire' },
];

export const docTemplates: DocTemplate[] = [
  { id: 'motivation', label: 'Lettre de motivation',
    fields: [...common, { name: 'poste', label: 'Poste visé' }, { name: 'entreprise', label: 'Entreprise' }, { name: 'corps', label: 'Vos motivations', type: 'textarea' }],
    build: (v) => ({ title: 'Lettre de motivation', body: `${head(v)}\nObjet : Candidature au poste de ${v.poste || '...'}\n\nMadame, Monsieur,\n\nJe me permets de vous adresser ma candidature au poste de ${v.poste || '...'} au sein de ${v.entreprise || '...'}.\n\n${v.corps || ''}\n\nJe reste à votre disposition pour un entretien.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.\n\n${v.senderName || ''}` }) },
  { id: 'demission', label: 'Lettre de démission',
    fields: [...common, { name: 'poste', label: 'Votre poste' }, { name: 'preavis', label: 'Durée du préavis' }],
    build: (v) => ({ title: 'Lettre de démission', body: `${head(v)}\nObjet : Démission\n\nMadame, Monsieur,\n\nPar la présente, je vous informe de ma décision de démissionner de mon poste de ${v.poste || '...'}.\n\nConformément à mon contrat, je respecterai un préavis de ${v.preavis || '...'} à compter de la réception de ce courrier.\n\nJe vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.\n\n${v.senderName || ''}` }) },
  { id: 'conge', label: 'Demande de congé',
    fields: [...common, { name: 'debut', label: 'Date de début', type: 'date' }, { name: 'fin', label: 'Date de fin', type: 'date' }, { name: 'motif', label: 'Motif', type: 'textarea' }],
    build: (v) => ({ title: 'Demande de congé', body: `${head(v)}\nObjet : Demande de congé\n\nMadame, Monsieur,\n\nJe sollicite l'autorisation de m'absenter du ${v.debut || '...'} au ${v.fin || '...'}.\n\n${v.motif || ''}\n\nDans l'attente de votre accord, je vous prie d'agréer mes salutations distinguées.\n\n${v.senderName || ''}` }) },
  { id: 'attestation', label: 'Attestation',
    fields: [...common, { name: 'objet', label: "Objet de l'attestation", type: 'textarea' }],
    build: (v) => ({ title: 'Attestation', body: `${head(v)}\nATTESTATION\n\nJe soussigné(e) ${v.senderName || '...'}, atteste sur l'honneur que :\n\n${v.objet || ''}\n\nFait pour servir et valoir ce que de droit.\n\n${v.city || ''}, le ${v.date || today()}\n${v.senderName || ''}` }) },
  { id: 'reclamation', label: 'Réclamation',
    fields: [...common, { name: 'objet', label: 'Objet de la réclamation' }, { name: 'corps', label: 'Détails', type: 'textarea' }],
    build: (v) => ({ title: 'Réclamation', body: `${head(v)}\nObjet : Réclamation - ${v.objet || '...'}\n\nMadame, Monsieur,\n\n${v.corps || ''}\n\nJe vous remercie de bien vouloir traiter ma réclamation dans les meilleurs délais.\n\nCordialement,\n${v.senderName || ''}` }) },
  { id: 'admin', label: 'Demande administrative',
    fields: [...common, { name: 'objet', label: 'Objet' }, { name: 'corps', label: 'Votre demande', type: 'textarea' }],
    build: (v) => ({ title: 'Demande administrative', body: `${head(v)}\nObjet : ${v.objet || '...'}\n\nMadame, Monsieur,\n\n${v.corps || ''}\n\nJe vous remercie par avance et vous prie d'agréer mes salutations distinguées.\n\n${v.senderName || ''}` }) },
  { id: 'pro', label: 'Lettre professionnelle',
    fields: [...common, { name: 'objet', label: 'Objet' }, { name: 'corps', label: 'Contenu', type: 'textarea' }],
    build: (v) => ({ title: 'Lettre professionnelle', body: `${head(v)}\nObjet : ${v.objet || '...'}\n\nMadame, Monsieur,\n\n${v.corps || ''}\n\nCordialement,\n${v.senderName || ''}` }) },
  { id: 'contrat', label: 'Contrat simple',
    fields: [{ name: 'partie1', label: 'Partie 1' }, { name: 'partie2', label: 'Partie 2' }, { name: 'objet', label: "Objet du contrat" }, { name: 'conditions', label: 'Conditions', type: 'textarea' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'lieu', label: 'Lieu' }],
    build: (v) => ({ title: 'Contrat', body: `CONTRAT\n\nEntre ${v.partie1 || '...'} (ci-après "la Partie 1")\nEt ${v.partie2 || '...'} (ci-après "la Partie 2")\n\nObjet : ${v.objet || '...'}\n\nConditions :\n${v.conditions || ''}\n\nFait à ${v.lieu || '...'}, le ${v.date || today()}\n\nSignature Partie 1 :                    Signature Partie 2 :` }) },
  { id: 'facture', label: 'Facture',
    fields: [{ name: 'numero', label: 'N° facture' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'emetteur', label: 'Émetteur' }, { name: 'client', label: 'Client' }, { name: 'designation', label: 'Désignation', type: 'textarea' }, { name: 'montantHT', label: 'Montant HT (€)', type: 'number' }, { name: 'tva', label: 'TVA (%)', type: 'number' }],
    build: (v) => { const ht = parseFloat(v.montantHT || '0'); const tva = parseFloat(v.tva || '20'); const ttc = ht * (1 + tva / 100); return { title: 'Facture ' + (v.numero || ''), body: `FACTURE N° ${v.numero || '...'}\nDate : ${v.date || today()}\n\nÉmetteur : ${v.emetteur || '...'}\nClient : ${v.client || '...'}\n\nDésignation :\n${v.designation || ''}\n\nMontant HT : ${ht.toFixed(2)} €\nTVA (${tva}%) : ${(ttc - ht).toFixed(2)} €\nTotal TTC : ${ttc.toFixed(2)} €` }; } },
  { id: 'devis', label: 'Devis',
    fields: [{ name: 'numero', label: 'N° devis' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'emetteur', label: 'Émetteur' }, { name: 'client', label: 'Client' }, { name: 'designation', label: 'Prestation', type: 'textarea' }, { name: 'montantHT', label: 'Montant HT (€)', type: 'number' }, { name: 'tva', label: 'TVA (%)', type: 'number' }, { name: 'validite', label: 'Validité (jours)', type: 'number' }],
    build: (v) => { const ht = parseFloat(v.montantHT || '0'); const tva = parseFloat(v.tva || '20'); const ttc = ht * (1 + tva / 100); return { title: 'Devis ' + (v.numero || ''), body: `DEVIS N° ${v.numero || '...'}\nDate : ${v.date || today()}\nValidité : ${v.validite || '30'} jours\n\nÉmetteur : ${v.emetteur || '...'}\nClient : ${v.client || '...'}\n\nPrestation :\n${v.designation || ''}\n\nMontant HT : ${ht.toFixed(2)} €\nTVA (${tva}%) : ${(ttc - ht).toFixed(2)} €\nTotal TTC : ${ttc.toFixed(2)} €` }; } },
];
