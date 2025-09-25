import type { Service, Invoice } from './types';
import { parse } from 'date-fns';

export const SERVICES: Service[] = [
  { id: 'FINANCES', name: 'Finances', designation: 'Finances', password: '1234' },
  { id: 'COMMANDE PUBLIQUE', name: 'Commande Publique', designation: 'Commande publique', password: '1234' },
  { id: 'SGDG', name: 'Direction Générale', designation: 'Direction Générale', password: '1234' },
  { id: 'SGAFFGENER', name: 'Affaires Générales', designation: 'Affaires Générales', password: '1234' },
  { id: 'SGJURID', name: 'Juridique', designation: 'Juridique', password: '1234' },
  { id: 'SGCOMMUNIC', name: 'Communication', designation: 'Communication', password: '1234' },
  { id: 'SGCULTURE', name: 'Culture', designation: 'Culture', password: '1234' },
  { id: 'SGTHEATRE', name: 'Théâtre', designation: 'Théâtre Municipal', password: '1234' },
  { id: 'SGPOLICE', name: 'Police Municipale', designation: 'Police Municipale', password: '1234' },
  { id: 'SGRH', name: 'Ressources Humaines', designation: 'Ressources Humaines', password: '1234' },
  { id: 'SGPROPURB', name: 'Propreté Urbaine', designation: 'Propreté Urbaine', password: '1234' },
  { id: 'SGESPVERTS', name: 'Espaces Verts', designation: 'Espaces Verts', password: '1234' },
  { id: 'SGSPORTS', name: 'Sports', designation: 'Sports', password: '1234' },
  { id: 'SGSCOLAIRE', name: 'Scolaire', designation: 'Affaires Scolaires', password: '1234' },
  { id: 'SGCS', name: 'Centre Sociaux', designation: 'Centre Sociaux', password: '1234' },
  { id: 'CCAS', name: 'CCAS', designation: 'CCAS', password: '1234' },
  { id: 'DRE', name: 'DRE', designation: 'DRE', password: '1234' },
  { id: 'SGPOLITVILLE', name: 'Politique de la Ville', designation: 'Politique de la Ville', password: '1234' },
  { id: 'SAAD', name: 'SAAD', designation: 'SAAD', password: '1234' },
  { id: 'SGST', name: 'Services Techniques', designation: 'Services Techniques', password: '1234' },
  { id: 'SGINFORMAT', name: 'Informatique', designation: 'Informatique', password: '1234' },
  { id: 'SGBIBLI', name: 'Bibliothèque', designation: 'Bibliothèque Municipale', password: '1234' },
  { id: 'SGRESTO', name: 'Restauration', designation: 'Restauration Municipale', password: '1234' },
  { id: 'SGVIEASSO', name: 'Vie Associative', designation: 'Vie Associative', password: '1234' },
  { id: 'SGMULTIACC', name: 'Multi-accueil', designation: 'Multi-accueil', password: '1234' },
  { id: 'SGAFP', name: 'AFP', designation: 'AFP', password: '1234' },
  { id: 'SGRAM', name: 'RAM', designation: 'RAM', password: '1234' },
  { id: 'SGGDSTRAV', name: 'Grands Travaux', designation: 'Grands Travaux', password: '1234' },
  { id: 'SGMAGASIN', name: 'Magasin', designation: 'Magasin Municipal', password: '1234' },
  { id: 'SGELUS', name: 'Elus', designation: 'Elus', password: '1234' },
  { id: 'SGENTRET', name: 'Entretien', designation: 'Entretien', password: '1234' },
  { id: 'SGRECPT', name: 'Réception', designation: 'Réception', password: '1234' },
  { id: 'SGREPDOM', name: 'Repas à domicile', designation: 'Repas à domicile', password: '1234' },
  { id: 'SGFINANCES', name: 'Finances (SG)', designation: 'Finances (SG)', password: '1234' },
  { id: 'SGCOMPUB', name: 'Comptabilité publique', designation: 'Comptabilité publique', password: '1234' },
];

const parseFileName = (fileName: string): Pick<Invoice, 'service' | 'depositDate' | 'expenseType' | 'amount' | 'isInvalid'> => {
  const nameWithoutExt = fileName.replace('.pdf', '');
  const parts = nameWithoutExt.split('-');
  
  let isInvalid = false;
  
  if (parts.length < 5) {
    isInvalid = true;
    return {
        service: 'INCONNU',
        depositDate: new Date(),
        expenseType: 'Inconnu',
        amount: 0,
        isInvalid: true,
    };
  }

  const [service, , , typeStr, amountStr] = parts;

  const specialServices = ['CCAS', 'SAAD', 'DRE'];
  if (!service.startsWith('SG') && !specialServices.includes(service) && service !== 'COMMANDE' && service !== 'FINANCES') {
    isInvalid = true;
  }

  const expenseTypeMap: { [key: string]: Invoice['expenseType'] } = {
    'F': 'Fonctionnement',
    'FL': 'Fluide',
    'I': 'Investissement',
  };
  const expenseType = expenseTypeMap[typeStr] || 'Inconnu';
  if (expenseType === 'Inconnu') {
    isInvalid = true;
  }

  const amount = amountStr ? parseFloat(amountStr.replace('(', '').replace(')', '').replace(',', '.')) : 0;
  if (isNaN(amount)) {
    isInvalid = true;
  }

  return {
    service: service === 'COMMANDE' ? 'COMMANDE PUBLIQUE' : service || 'INCONNU',
    depositDate: new Date(),
    expenseType,
    amount,
    isInvalid,
  };
};


const initialInvoices: Omit<Invoice, 'id'>[] = [
  { fileName: 'SGINFORMAT-ORANGE-12345-F-(1250.50).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGINFORMAT-ORANGE-12345-F-(1250.50).pdf')},
  { fileName: 'SGESPVERTS-DEVEAUX-67890-I-(8500.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGESPVERTS-DEVEAUX-67890-I-(8500.00).pdf')},
  { fileName: 'CCAS-FOURNISSEURC-11223-F-(345.20).pdf', status: 'À traiter', cpRef: '', comments: [{id: 'c1', user: 'CCAS', text: 'Urgent svp.', timestamp: new Date()}], ...parseFileName('CCAS-FOURNISSEURC-11223-F-(345.20).pdf')},
  { fileName: 'SGSPORTS-EDF-33445-FL-(2100.75).pdf', status: 'Validé CP', cpRef: 'CP2024-001', comments: [{id: 'c2', user: 'Commande Publique', text: 'Validé.', timestamp: new Date()}], ...parseFileName('SGSPORTS-EDF-33445-FL-(2100.75).pdf')},
  { fileName: 'SGCULTURE-FNAC-55667-F-(830.00).pdf', status: 'À mandater', cpRef: 'CP2024-002', comments: [{id: 'c3-1', user: 'Commande Publique', text: 'OK pour moi', timestamp: new Date()}, {id: 'c3-2', user: 'SGCULTURE', text: 'Validé également', timestamp: new Date()}], ...parseFileName('SGCULTURE-FNAC-55667-F-(830.00).pdf')},
  { fileName: 'SGRH-MANPOWER-99001-F-(120.00).pdf', status: 'Mandatée', cpRef: 'CP2024-003', comments: [], ...parseFileName('SGRH-MANPOWER-99001-F-(120.00).pdf')},
  { fileName: 'SGJURID-LEXISNEXIS-31415-F-(550.00).pdf', status: 'Rejeté CP', cpRef: 'CP2024-005', comments: [{id: 'c5', user: 'Commande Publique', text: 'Facture non conforme', timestamp: new Date()}], ...parseFileName('SGJURID-LEXISNEXIS-31415-F-(550.00).pdf')},
  { fileName: 'SGSCOLAIRE-MAJUSCULE-16180-F-(2300.00).pdf', status: 'Rejeté Service', cpRef: 'CP2024-006', comments: [{id: 'c6-1', user: 'Commande Publique', text: 'Ok', timestamp: new Date()}, {id: 'c6-2', user: 'SGSCOLAIRE', text: 'Refusé, matériel non livré.', timestamp: new Date()}], ...parseFileName('SGSCOLAIRE-MAJUSCULE-16180-F-(2300.00).pdf')},
  { fileName: 'URGENT_FOURNISSEURK_100.pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('URGENT_FOURNISSEURK_100.pdf')},
  { fileName: 'SGST-SULO-XYZ-X-(250.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGST-SULO-XYZ-X-(250.00).pdf')},
  { fileName: 'DRE-EIFFAGE-27182-I-(4200.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('DRE-EIFFAGE-27182-I-(4200.00).pdf')},
  { fileName: 'SGMAGASIN-BRICOMAN-31447-F-(680.30).pdf', status: 'À mandater', cpRef: 'CP2024-007', comments: [], ...parseFileName('SGMAGASIN-BRICOMAN-31447-F-(680.30).pdf')},
  { fileName: 'SGCOMPUB-PAPETERIE-001-F-(150.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGCOMPUB-PAPETERIE-001-F-(150.00).pdf')},
  { fileName: 'SGFINANCES-ASSURANCE-002-F-(2500.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGFINANCES-ASSURANCE-002-F-(2500.00).pdf')},
  { fileName: 'SAAD-AIDESERVICE-54321-F-(250.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SAAD-AIDESERVICE-54321-F-(250.00).pdf') },
  { fileName: 'SGELUS-RECEPTION-65432-F-(1200.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGELUS-RECEPTION-65432-F-(1200.00).pdf') },
  { fileName: 'SGGDSTRAV-COLAS-76543-I-(15000.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGGDSTRAV-COLAS-76543-I-(15000.00).pdf') },
  { fileName: 'SGAFP-FORMATION-87654-F-(800.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGAFP-FORMATION-87654-F-(800.00).pdf') },
];


export const INVOICES: Invoice[] = initialInvoices.map((invoice, index) => ({
  id: `INV-${String(index + 1).padStart(4, '0')}`,
  ...invoice,
}));
