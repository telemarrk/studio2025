
"use client";

import * as React from "react";
import { useApp } from "@/components/app-provider";
import type { Invoice, InvoiceStatus } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, FilePen, Send, Hourglass, Banknote, Building, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


const statusConfig: { [key in InvoiceStatus]: { icon: React.ElementType, color: string, label: string } } = {
    'À traiter': { icon: Hourglass, color: 'text-blue-500', label: 'À traiter' },
    'Validé CP': { icon: Check, color: 'text-yellow-500', label: 'Validé CP' },
    'À mandater': { icon: Send, color: 'text-orange-500', label: 'À mandater' },
    'Mandatée': { icon: Banknote, color: 'text-green-500', label: 'Mandatée' },
    'Rejeté CP': { icon: X, color: 'text-red-500', label: 'Rejeté CP' },
    'Rejeté Service': { icon: X, color: 'text-red-500', label: 'Rejeté Service' },
    'Rejeté Finances': { icon: X, color: 'text-red-500', label: 'Rejeté Finances' },
    'Traité': { icon: Check, color: 'text-gray-500', label: 'Traité' },
};

const statusColors: { [key in InvoiceStatus]: string } = {
    'À traiter': 'bg-blue-500 hover:bg-blue-500/80',
    'Validé CP': 'bg-yellow-500 hover:bg-yellow-500/80',
    'À mandater': 'bg-orange-500 hover:bg-orange-500/80',
    'Mandatée': 'bg-green-500 hover:bg-green-500/80',
    'Rejeté CP': 'bg-red-500 hover:bg-red-500/80',
    'Rejeté Service': 'bg-red-500 hover:bg-red-500/80',
    'Rejeté Finances': 'bg-red-500 hover:bg-red-500/80',
    'Traité': 'bg-gray-500 hover:bg-gray-500/80',
};


const RoleSpecificActions: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const { currentUser, updateInvoiceStatus, updateInvoiceCpRef, addComment } = useApp();
    const [cpRef, setCpRef] = React.useState(invoice.cpRef);
    const [comment, setComment] = React.useState('');

    if (!currentUser) return null;

    const handleCpRefUpdate = () => {
        updateInvoiceCpRef(invoice.id, cpRef);
    };

    const renderActions = () => {
        switch (currentUser.role) {
            case 'COMMANDE PUBLIQUE':
                if (invoice.status === 'À traiter') {
                    return (
                        <>
                            <Input
                                placeholder="Réf. CP"
                                value={cpRef}
                                onChange={(e) => setCpRef(e.target.value)}
                                className="w-32"
                            />
                            <Button size="sm" onClick={() => { handleCpRefUpdate(); updateInvoiceStatus(invoice.id, 'Validé CP'); }} disabled={!cpRef}>
                                <Check className="mr-2 h-4 w-4" /> Valider
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive"><X className="mr-2 h-4 w-4" /> Rejeter</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Motif du rejet</AlertDialogTitle></AlertDialogHeader>
                                    <Textarea placeholder="Expliquez pourquoi la facture est rejetée..." value={comment} onChange={e => setComment(e.target.value)} />
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => updateInvoiceStatus(invoice.id, 'Rejeté CP', comment)} disabled={!comment}>Confirmer le rejet</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    );
                }
                break;
            case 'SERVICE':
                 if (invoice.status === 'Validé CP' || invoice.status === 'Rejeté Service') {
                    return (
                        <>
                            <Button size="sm" onClick={() => updateInvoiceStatus(invoice.id, 'À mandater')}>
                                <Check className="mr-2 h-4 w-4" /> Valider
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive"><X className="mr-2 h-4 w-4" /> Rejeter</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Motif du rejet</AlertDialogTitle></AlertDialogHeader>
                                    <Textarea placeholder="Expliquez pourquoi la facture est rejetée..." value={comment} onChange={e => setComment(e.target.value)} />
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => updateInvoiceStatus(invoice.id, 'Rejeté Service', comment)} disabled={!comment}>Confirmer le rejet</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    );
                }
                break;
            case 'FINANCES':
                if (invoice.status === 'À mandater') {
                     return (
                        <>
                            <Button size="sm" onClick={() => updateInvoiceStatus(invoice.id, 'Mandatée')}>
                                <Check className="mr-2 h-4 w-4" /> Mandater
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive"><X className="mr-2 h-4 w-4" /> Rejeter</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Motif du rejet</AlertDialogTitle></AlertDialogHeader>
                                    <Textarea placeholder="Expliquez pourquoi la facture est rejetée..." value={comment} onChange={e => setComment(e.target.value)} />
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => updateInvoiceStatus(invoice.id, 'Rejeté Finances', comment)} disabled={!comment}>Confirmer le rejet</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    );
                }
                break;
            default:
                return null;
        }
    };

    return <div className="flex items-center gap-2">{renderActions()}</div>;
};


export default function DashboardPage() {
    const { currentUser, invoices, services } = useApp();

    const invoicesForUser = React.useMemo(() => {
        if (!currentUser) return [];

        const specialServices = ['CCAS', 'SAAD', 'DRE'];

        switch (currentUser.role) {
            case 'FINANCES':
                return invoices.filter(inv => inv.status === 'À mandater' || inv.status === 'Mandatée');
            case 'COMMANDE PUBLIQUE':
                return invoices.filter(inv => inv.status === 'À traiter' && !specialServices.includes(inv.service));
            case 'SERVICE':
                 if (specialServices.includes(currentUser.id)) {
                    return invoices.filter(inv => inv.service === currentUser.id && (inv.status === 'À traiter' || inv.status === 'Rejeté Service'));
                 }
                return invoices.filter(inv => inv.service === currentUser.id && (inv.status === 'Validé CP' || inv.status === 'Rejeté Service'));
            default:
                return [];
        }
    }, [currentUser, invoices]);
    
    const stats = React.useMemo(() => {
        const total = invoicesForUser.length;
        const toProcess = invoicesForUser.filter(inv => ['À traiter', 'Validé CP', 'À mandater'].includes(inv.status)).length;
        const rejected = invoicesForUser.filter(inv => inv.status.startsWith('Rejeté')).length;
        return { total, toProcess, rejected };
    }, [invoicesForUser]);

    if (!currentUser) {
        return <div className="flex h-full items-center justify-center"><p>Chargement des données utilisateur...</p></div>;
    }
    
    const getRoleIcon = () => {
        switch (currentUser.role) {
            case 'FINANCES': return Banknote;
            case 'COMMANDE PUBLIQUE': return Building;
            case 'SERVICE': return FileText;
            default: return FileText;
        }
    };
    
    const RoleIcon = getRoleIcon();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <RoleIcon className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle className="text-2xl font-headline">Tableau de bord</CardTitle>
                            <CardDescription>Factures nécessitant votre attention</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">À traiter</CardTitle>
                                <Hourglass className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.toProcess}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
                                <X className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.rejected}</div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des factures</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom du fichier</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Date de dépôt</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoicesForUser.length > 0 ? (
                                    invoicesForUser.map((invoice) => (
                                        <TableRow key={invoice.id} className={invoice.isInvalid ? 'bg-red-900/20' : ''}>
                                            <TableCell className="font-medium">{invoice.fileName}</TableCell>
                                            <TableCell>{services.find(s => s.id === invoice.service)?.name || invoice.service}</TableCell>
                                            <TableCell>{format(invoice.depositDate, 'dd/MM/yyyy', { locale: fr })}</TableCell>
                                            <TableCell className="text-right">{invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                                            <TableCell>
                                                <Badge className={cn("text-white", statusColors[invoice.status])} variant="default">{invoice.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                { invoice.isInvalid ? (
                                                     <Badge variant="destructive">Nom de fichier invalide</Badge>
                                                ) : <RoleSpecificActions invoice={invoice} /> }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Aucune facture à traiter pour le moment.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    