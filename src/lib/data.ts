import type { Service, Invoice } from './types';
import { parse } from 'date-fns';

export const SERVICES: Service[] = [
  { id: 'FINANCES', name: 'Finances', designation: 'Service des finances', password: '1234' },
  { id: 'COMMANDE PUBLIQUE', name: 'Commande Publique', designation: 'Service de la commande publique', password: '1234' },
  { id: 'SGDG', name: 'SG - Direction Générale', designation: 'Direction Générale', password: '1234' },
  { id: 'SGAFFGENER', name: 'SG - Affaires Générales', designation: 'Affaires Générales', password: '1234' },
  { id: 'SGJURID', name: 'SG - Juridique', designation: 'Service Juridique', password: '1234' },
  { id: 'SGCOMMUNIC', name: 'SG - Communication', designation: 'Service Communication', password: '1234' },
  { id: 'SGCULTURE', name: 'SG - Culture', designation: 'Service Culture', password: '1234' },
  { id: 'SGTHEATRE', name: 'SG - Théâtre', designation: 'Théâtre Municipal', password: '1234' },
  { id: 'SGPOLICE', name: 'SG - Police Municipale', designation: 'Police Municipale', password: '1234' },
  { id: 'SGRH', name: 'SG - Ressources Humaines', designation: 'Ressources Humaines', password: '1234' },
  { id: 'SGFINANCES', name: 'SG - Finances', designation: 'Service des Finances (SG)', password: '1234' },
  { id: 'SGPROPURB', name: 'SG - Propreté Urbaine', designation: 'Propreté Urbaine', password: '1234' },
  { id: 'SGESPVERTS', name: 'SG - Espaces Verts', designation: 'Espaces Verts', password: '1234' },
  { id: 'SGSPORTS', name: 'SG - Sports', designation: 'Service des Sports', password: '1234' },
  { id: 'SGSCOLAIRE', name: 'SG - Scolaire', designation: 'Affaires Scolaires', password: '1234' },
  { id: 'SGCS', name: 'SG - Centre Sociaux', designation: 'Centre Sociaux', password: '1234' },
  { id: 'CCAS', name: 'CCAS', designation: 'Centre Communal d\'Action Sociale', password: '1234' },
  { id: 'DRE', name: 'DRE', designation: 'DRE', password: '1234' },
  { id: 'SGPOLITVILLE', name: 'SG - Politique de la Ville', designation: 'Politique de la Ville', password: '1234' },
  { id: 'SAAD', name: 'SAAD', designation: 'Service d\'Aide et d\'Accompagnement à Domicile', password: '1234' },
  { id: 'SGST', name: 'SG - Services Techniques', designation: 'Services Techniques', password: '1234' },
  { id: 'SGINFORMAT', name: 'SG - Informatique', designation: 'Service Informatique', password: '1234' },
  { id: 'SGBIBLI', name: 'SG - Bibliothèque', designation: 'Bibliothèque Municipale', password: '1234' },
  { id: 'SGRESTO', name: 'SG - Restauration', designation: 'Restauration Municipale', password: '1234' },
  { id: 'SGVIEASSO', name: 'SG - Vie Associative', designation: 'Vie Associative', password: '1234' },
  { id: 'SGMULTIACC', name: 'SG - Multi-accueil', designation: 'Multi-accueil', password: '1234' },
  { id: 'SGAFP', name: 'SG - AFP', designation: 'AFP', password: '1234' },
  { id: 'SGRAM', name: 'SG - RAM', designation: 'RAM', password: '1234' },
  { id: 'SGGDSTRAV', name: 'SG - Grands Travaux', designation: 'Grands Travaux', password: '1234' },
  { id: 'SGMAGASIN', name: 'SG - Magasin', designation: 'Magasin Municipal', password: '1234' },
  { id: 'SGCOMPUB', name: 'SG - Comptabilité Publique', designation: 'Comptabilité Publique', password: '1234' },
];

const parseFileName = (fileName: string): Pick<Invoice, 'service' | 'depositDate' | 'expenseType' | 'amount' | 'isInvalid'> => {
  const nameWithoutExt = fileName.replace('.pdf', '');
  const parts = nameWithoutExt.split('-');
  
  let isInvalid = false;
  
  // SGRH-AUCHAN-05687-F-(452.65) -> 5 parts
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
  if (!service.startsWith('SG') && !specialServices.includes(service)) {
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
    service: service || 'INCONNU',
    depositDate: new Date(), // Date logic is removed as it's not in the new filename format
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
  { fileName: 'SAAD-FOURNISSEURF-77889-F-(99.99).pdf', status: 'À mandater', cpRef: '', comments: [{id: 'c4', user: 'SAAD', text: 'Validé', timestamp: new Date()}], ...parseFileName('SAAD-FOURNISSEURF-77889-F-(99.99).pdf')},
  { fileName: 'SGRH-MANPOWER-99001-F-(120.00).pdf', status: 'Mandatée', cpRef: 'CP2024-003', comments: [], ...parseFileName('SGRH-MANPOWER-99001-F-(120.00).pdf')},
  { fileName: 'SGDCVTP-COLAS-11121-I-(15000.00).pdf', status: 'Mandatée', cpRef: 'CP2024-004', comments: [], ...parseFileName('SGDCVTP-COLAS-11121-I-(15000.00).pdf')},
  { fileName: 'SGJURID-LEXISNEXIS-31415-F-(550.00).pdf', status: 'Rejeté CP', cpRef: 'CP2024-005', comments: [{id: 'c5', user: 'Commande Publique', text: 'Facture non conforme', timestamp: new Date()}], ...parseFileName('SGJURID-LEXISNEXIS-31415-F-(550.00).pdf')},
  { fileName: 'SGSCOLAIRE-MAJUSCULE-16180-F-(2300.00).pdf', status: 'Rejeté Service', cpRef: 'CP2024-006', comments: [{id: 'c6-1', user: 'Commande Publique', text: 'Ok', timestamp: new Date()}, {id: 'c6-2', user: 'SGSCOLAIRE', text: 'Refusé, matériel non livré.', timestamp: new Date()}], ...parseFileName('SGSCOLAIRE-MAJUSCULE-16180-F-(2300.00).pdf')},
  { fileName: 'URGENT_FOURNISSEURK_100.pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('URGENT_FOURNISSEURK_100.pdf')},
  { fileName: 'SGST-SULO-XYZ-X-(250.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGST-SULO-XYZ-X-(250.00).pdf')},
  { fileName: 'DRE-EIFFAGE-27182-I-(4200.00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('DRE-EIFFAGE-27182-I-(4200.00).pdf')},
  { fileName: 'SGMAGASIN-BRICOMAN-31447-F-(680.30).pdf', status: 'À mandater', cpRef: 'CP2024-007', comments: [], ...parseFileName('SGMAGASIN-BRICOMAN-31447-F-(680.30).pdf')},
];


export const INVOICES: Invoice[] = initialInvoices.map((invoice, index) => ({
  id: `INV-${String(index + 1).padStart(4, '0')}`,
  ...invoice,
}));
