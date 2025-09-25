import type { Service, Invoice } from './types';
import { parse } from 'date-fns';

export const SERVICES: Service[] = [
  { id: 'FINANCES', name: 'Finances', designation: 'Service des finances' },
  { id: 'COMMANDE PUBLIQUE', name: 'Commande Publique', designation: 'Service de la commande publique' },
  { id: 'SGDG', name: 'SG - Direction Générale', designation: 'Direction Générale' },
  { id: 'SGAFFGENER', name: 'SG - Affaires Générales', designation: 'Affaires Générales' },
  { id: 'SGJURID', name: 'SG - Juridique', designation: 'Service Juridique' },
  { id: 'SGCOMMUNIC', name: 'SG - Communication', designation: 'Service Communication' },
  { id: 'SGCULTURE', name: 'SG - Culture', designation: 'Service Culture' },
  { id: 'SGTHEATRE', name: 'SG - Théâtre', designation: 'Théâtre Municipal' },
  { id: 'SGPOLICE', name: 'SG - Police Municipale', designation: 'Police Municipale' },
  { id: 'SGRH', name: 'SG - Ressources Humaines', designation: 'Ressources Humaines' },
  { id: 'SGFINANCES', name: 'SG - Finances', designation: 'Service des Finances (SG)' },
  { id: 'SGDCVTP', name: 'SG - DCVTP', designation: 'DCVTP' },
  { id: 'SGPROPURB', name: 'SG - Propreté Urbaine', designation: 'Propreté Urbaine' },
  { id: 'SGESPVERTS', name: 'SG - Espaces Verts', designation: 'Espaces Verts' },
  { id: 'SGSPORTS', name: 'SG - Sports', designation: 'Service des Sports' },
  { id: 'SGSCOLAIRE', name: 'SG - Scolaire', designation: 'Affaires Scolaires' },
  { id: 'SGCS', name: 'SG - CS', designation: 'CS' },
  { id: 'CCAS', name: 'CCAS', designation: 'Centre Communal d\'Action Sociale' },
  { id: 'DRE', name: 'DRE', designation: 'DRE' },
  { id: 'SGPOLITVILLE', name: 'SG - Politique de la Ville', designation: 'Politique de la Ville' },
  { id: 'SAAD', name: 'SAAD', designation: 'Service d\'Aide et d\'Accompagnement à Domicile' },
  { id: 'SGST', name: 'SG - ST', designation: 'ST' },
  { id: 'SGINFORMAT', name: 'SG - Informatique', designation: 'Service Informatique' },
  { id: 'SGBIBLI', name: 'SG - Bibliothèque', designation: 'Bibliothèque Municipale' },
  { id: 'SGFETES', name: 'SG - Fêtes et Cérémonies', designation: 'Fêtes et Cérémonies' },
  { id: 'SGRESTO', name: 'SG - Restauration', designation: 'Restauration Municipale' },
  { id: 'SGVIEASSO', name: 'SG - Vie Associative', designation: 'Vie Associative' },
  { id: 'SGMULTIACC', name: 'SG - Multi-accueil', designation: 'Multi-accueil' },
  { id: 'SGAFP', name: 'SG - AFP', designation: 'AFP' },
  { id: 'SGRAM', name: 'SG - RAM', designation: 'RAM' },
  { id: 'SGGDSTRAV', name: 'SG - Grands Travaux', designation: 'Grands Travaux' },
  { id: 'SGMAGASIN', name: 'SG - Magasin', designation: 'Magasin Municipal' },
  { id: 'SGCOMPUB', name: 'SG - Comptabilité Publique', designation: 'Comptabilité Publique' },
];

const parseFileName = (fileName: string): Pick<Invoice, 'service' | 'depositDate' | 'expenseType' | 'amount' | 'isInvalid'> => {
  const parts = fileName.replace('.pdf', '').split('_');
  const [service, dateStr, typeStr, , amountStr] = parts;

  let isInvalid = false;
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

  return {
    service: service || 'INCONNU',
    depositDate: dateStr ? parse(dateStr, 'yyyyMMdd', new Date()) : new Date(),
    expenseType,
    amount: amountStr ? parseFloat(amountStr.replace('(', '').replace(')', '').replace(',', '.')) : 0,
    isInvalid,
  };
};

const initialInvoices: Omit<Invoice, 'id'>[] = [
  { fileName: 'SGINFORMAT_20240720_F_FournisseurA_(1250,50).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGINFORMAT_20240720_F_FournisseurA_(1250,50).pdf')},
  { fileName: 'SGESPVERTS_20240721_I_FournisseurB_(8500,00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGESPVERTS_20240721_I_FournisseurB_(8500,00).pdf')},
  { fileName: 'CCAS_20240722_F_FournisseurC_(345,20).pdf', status: 'À traiter', cpRef: '', comments: [{id: 'c1', user: 'CCAS', text: 'Urgent svp.', timestamp: new Date()}], ...parseFileName('CCAS_20240722_F_FournisseurC_(345,20).pdf')},
  { fileName: 'SGSPORTS_20240715_FL_FournisseurD_(2100,75).pdf', status: 'Validé CP', cpRef: 'CP2024-001', comments: [{id: 'c2', user: 'Commande Publique', text: 'Validé.', timestamp: new Date()}], ...parseFileName('SGSPORTS_20240715_FL_FournisseurD_(2100,75).pdf')},
  { fileName: 'SGCULTURE_20240710_F_FournisseurE_(830,00).pdf', status: 'À mandater', cpRef: 'CP2024-002', comments: [{id: 'c3-1', user: 'Commande Publique', text: 'OK pour moi', timestamp: new Date()}, {id: 'c3-2', user: 'SGCULTURE', text: 'Validé également', timestamp: new Date()}], ...parseFileName('SGCULTURE_20240710_F_FournisseurE_(830,00).pdf')},
  { fileName: 'SAAD_20240718_F_FournisseurF_(99,99).pdf', status: 'À mandater', cpRef: '', comments: [{id: 'c4', user: 'SAAD', text: 'Validé', timestamp: new Date()}], ...parseFileName('SAAD_20240718_F_FournisseurF_(99,99).pdf')},
  { fileName: 'SGRH_20240620_F_FournisseurG_(120,00).pdf', status: 'Mandatée', cpRef: 'CP2024-003', comments: [], ...parseFileName('SGRH_20240620_F_FournisseurG_(120,00).pdf')},
  { fileName: 'SGDCVTP_20240615_I_FournisseurH_(15000,00).pdf', status: 'Mandatée', cpRef: 'CP2024-004', comments: [], ...parseFileName('SGDCVTP_20240615_I_FournisseurH_(15000,00).pdf')},
  { fileName: 'SGJURID_20240701_F_FournisseurI_(550,00).pdf', status: 'Rejeté CP', cpRef: 'CP2024-005', comments: [{id: 'c5', user: 'Commande Publique', text: 'Facture non conforme', timestamp: new Date()}], ...parseFileName('SGJURID_20240701_F_FournisseurI_(550,00).pdf')},
  { fileName: 'SGSCOLAIRE_20240705_F_FournisseurJ_(2300,00).pdf', status: 'Rejeté Service', cpRef: 'CP2024-006', comments: [{id: 'c6-1', user: 'Commande Publique', text: 'Ok', timestamp: new Date()}, {id: 'c6-2', user: 'SGSCOLAIRE', text: 'Refusé, matériel non livré.', timestamp: new Date()}], ...parseFileName('SGSCOLAIRE_20240705_F_FournisseurJ_(2300,00).pdf')},
  { fileName: 'URGENT_20240723_F_FournisseurK_(100,00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('URGENT_20240723_F_FournisseurK_(100,00).pdf')},
  { fileName: 'SGST_20240724_X_FournisseurL_(250,00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('SGST_20240724_X_FournisseurL_(250,00).pdf')},
  { fileName: 'DRE_20240719_I_FournisseurM_(4200,00).pdf', status: 'À traiter', cpRef: '', comments: [], ...parseFileName('DRE_20240719_I_FournisseurM_(4200,00).pdf')},
  { fileName: 'SGMAGASIN_20240711_F_FournisseurN_(680,30).pdf', status: 'À mandater', cpRef: 'CP2024-007', comments: [], ...parseFileName('SGMAGASIN_20240711_F_FournisseurN_(680,30).pdf')},
];

export const INVOICES: Invoice[] = initialInvoices.map((invoice, index) => ({
  id: `INV-${String(index + 1).padStart(4, '0')}`,
  ...invoice,
}));
