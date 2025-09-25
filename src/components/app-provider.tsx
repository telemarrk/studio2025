"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Service, Invoice, CurrentUser, InvoiceStatus } from '@/lib/types';
import { SERVICES, INVOICES } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  currentUser: CurrentUser | null;
  services: Service[];
  invoices: Invoice[];
  login: (serviceId: string, password: string) => boolean;
  logout: () => void;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus, comment?: string) => void;
  updateInvoiceCpRef: (invoiceId: string, ref: string) => void;
  addComment: (invoiceId: string, text: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  refreshData: () => void;
  revertInvoiceToMandater: (invoiceId: string) => void;
  markInvoiceAsTraite: (invoiceId: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !currentUser && pathname !== '/') {
        router.push('/');
    }
    if (!isLoading && currentUser && pathname === '/') {
        router.push('/dashboard');
    }
  }, [currentUser, pathname, router, isLoading]);

  const login = (serviceId: string, password: string): boolean => {
    const service = services.find(s => s.id === serviceId);
    if (service && service.password === password) {
      const role = service.id === 'FINANCES' ? 'FINANCES' : service.id === 'COMMANDE PUBLIQUE' ? 'COMMANDE PUBLIQUE' : 'SERVICE';
      const user: CurrentUser = { id: service.id, name: service.name, role };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({ title: "Connexion réussie", description: `Bienvenue, ${service.name}!` });
      return true;
    }
    toast({ variant: "destructive", title: "Erreur de connexion", description: "Le service ou le mot de passe est incorrect." });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    router.push('/');
    toast({ title: "Déconnexion", description: "Vous avez été déconnecté." });
  };
  
  const refreshData = () => {
    setInvoices(INVOICES);
    setServices(SERVICES);
    toast({ title: "Données actualisées", description: "Les factures et services ont été rechargés." });
  };
  
  const updateInvoice = useCallback((invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === invoiceId ? { ...inv, ...updates } : inv))
    );
  }, []);

  const addComment = useCallback((invoiceId: string, text: string) => {
    if (!currentUser) return;
    const newComment = {
      id: `c${Date.now()}`,
      user: currentUser.name,
      text,
      timestamp: new Date(),
    };
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      updateInvoice(invoiceId, { comments: [...invoice.comments, newComment] });
    }
  }, [currentUser, invoices, updateInvoice]);

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus, comment?: string) => {
    updateInvoice(invoiceId, { status });
    if (comment) {
      addComment(invoiceId, comment);
    }
    toast({ title: "Statut mis à jour", description: `La facture est maintenant: ${status}` });
  };

  const updateInvoiceCpRef = (invoiceId: string, ref: string) => {
    updateInvoice(invoiceId, { cpRef: ref });
    toast({ title: "Référence CP ajoutée" });
  };
  
  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = { ...service, id: service.name.toUpperCase().replace(/\s/g, '') };
    setServices(prev => [...prev, newService]);
    toast({ title: "Service ajouté", description: `Le service ${service.name} a été créé.` });
  };

  const updateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    toast({ title: "Service modifié", description: `Le service ${updatedService.name} a été mis à jour.` });
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    toast({ title: "Service supprimé" });
  };
  
  const revertInvoiceToMandater = (invoiceId: string) => {
    updateInvoiceStatus(invoiceId, 'À mandater', "Statut précédent restauré par les Finances.");
  };

  const markInvoiceAsTraite = (invoiceId: string) => {
    updateInvoiceStatus(invoiceId, 'Traité', "Facture marquée comme traitée par les Finances.");
  };

  if (isLoading) {
      return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }

  return (
    <AppContext.Provider value={{
      currentUser, services, invoices, login, logout,
      updateInvoiceStatus, updateInvoiceCpRef, addComment,
      addService, updateService, deleteService,
      refreshData, revertInvoiceToMandater, markInvoiceAsTraite,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
