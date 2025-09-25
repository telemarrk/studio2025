export type Service = {
  id: string;
  name: string;
  designation: string;
};

export type UserRole = 
  | "FINANCES"
  | "COMMANDE PUBLIQUE"
  | "SERVICE";

export type CurrentUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type ExpenseType = "Fonctionnement" | "Fluide" | "Investissement" | "Inconnu";

export type InvoiceStatus = 
  | "À traiter"
  | "Validé CP"
  | "À mandater"
  | "Mandatée"
  | "Rejeté CP"
  | "Rejeté Service"
  | "Rejeté Finances"
  | "Traité";

export type Comment = {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
};

export type Invoice = {
  id: string;
  fileName: string;
  depositDate: Date;
  expenseType: ExpenseType;
  amount: number;
  service: string;
  cpRef: string;
  status: InvoiceStatus;
  comments: Comment[];
  isInvalid: boolean;
};
