
"use client";

import * as React from "react";
import { useApp } from "@/components/app-provider";
import type { Invoice, InvoiceStatus, Service, ExpenseType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Undo2, CheckCheck, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

export default function HistoryPage() {
    const { currentUser, invoices, services, revertInvoiceToMandater, markInvoiceAsTraite } = useApp();
    const { toast } = useToast();

    const [fileNameFilter, setFileNameFilter] = React.useState("");
    const [serviceFilter, setServiceFilter] = React.useState("all");
    const [expenseTypeFilter, setExpenseTypeFilter] = React.useState("all");
    const [amountFilter, setAmountFilter] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [today, setToday] = React.useState(new Date());

    const [isRevertDialogOpen, setIsRevertDialogOpen] = React.useState(false);
    const [selectedInvoiceForRevert, setSelectedInvoiceForRevert] = React.useState<Invoice | null>(null);
    const [revertPassword, setRevertPassword] = React.useState("");

    React.useEffect(() => {
        const timer = setInterval(() => {
            setToday(new Date());
        }, 1000 * 60 * 60 * 24); // Update once a day
        return () => clearInterval(timer);
    }, []);

    const filteredInvoices = React.useMemo(() => {
        let invoicesToShow = invoices;
        const specialServices = ['CCAS', 'SAAD', 'DRE'];

        if (currentUser?.role === 'COMMANDE PUBLIQUE') {
            invoicesToShow = invoices.filter(inv => !specialServices.includes(inv.service));
        }

        return invoicesToShow.filter(invoice => {
            const fileNameMatch = fileNameFilter ? invoice.fileName.toLowerCase().includes(fileNameFilter.toLowerCase()) : true;
            const serviceMatch = serviceFilter !== 'all' ? invoice.service === serviceFilter : true;
            const expenseTypeMatch = expenseTypeFilter !== 'all' ? invoice.expenseType === expenseTypeFilter : true;
            const amountMatch = amountFilter ? invoice.amount.toString().includes(amountFilter) : true;
            const statusMatch = statusFilter !== 'all' ? invoice.status === statusFilter : true;

            return fileNameMatch && serviceMatch && expenseTypeMatch && amountMatch && statusMatch;
        });
    }, [invoices, fileNameFilter, serviceFilter, expenseTypeFilter, amountFilter, statusFilter, currentUser]);

    const handleRevertClick = (invoice: Invoice) => {
        setSelectedInvoiceForRevert(invoice);
        setIsRevertDialogOpen(true);
        setRevertPassword("");
    };

    const handleRevertConfirm = () => {
        if (revertPassword === "Daf59") {
            if (selectedInvoiceForRevert) {
                revertInvoiceToMandater(selectedInvoiceForRevert.id);
            }
            setIsRevertDialogOpen(false);
            setSelectedInvoiceForRevert(null);
        } else {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Mot de passe incorrect.",
            });
        }
    };

    if (!currentUser || !['FINANCES', 'COMMANDE PUBLIQUE'].includes(currentUser.role)) {
        return (
            <div className="flex h-full items-center justify-center">
                <p>Vous n'avez pas l'autorisation d'accéder à cette page.</p>
            </div>
        );
    }

    const uniqueServices = [...new Set(invoices.map(i => i.service))].map(sId => services.find(s => s.id === sId)).filter(Boolean) as Service[];
    const uniqueExpenseTypes: ExpenseType[] = [...new Set(invoices.map(i => i.expenseType))];
    const uniqueStatuses: InvoiceStatus[] = [...new Set(invoices.map(i => i.status))];


    return (
        <TooltipProvider>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Historique des factures</CardTitle>
                        <CardDescription>Consultez et filtrez l'historique de toutes les factures traitées.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Nom du fichier..."
                                    value={fileNameFilter}
                                    onChange={(e) => setFileNameFilter(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={serviceFilter} onValueChange={setServiceFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrer par service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les services</SelectItem>
                                    {uniqueServices.sort((a,b) => a.name.localeCompare(b.name)).map(service => (
                                        <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={expenseTypeFilter} onValueChange={setExpenseTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrer par type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les types</SelectItem>
                                    {uniqueExpenseTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                <Input
                                    type="number"
                                    placeholder="Montant..."
                                    value={amountFilter}
                                    onChange={(e) => setAmountFilter(e.target.value)}
                                    className="pl-7"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    {uniqueStatuses.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom du fichier</TableHead>
                                        <TableHead>Date de dépôt</TableHead>
                                        <TableHead>Type de dépenses</TableHead>
                                        <TableHead className="text-right">Montant TTC</TableHead>
                                        <TableHead>Réf. CP</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Échéance</TableHead>
                                        {currentUser.role === 'FINANCES' && <TableHead className="text-center">Actions</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.length > 0 ? (
                                        filteredInvoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">{invoice.fileName}</TableCell>
                                                <TableCell>{format(invoice.depositDate, 'dd/MM/yyyy', { locale: fr })}</TableCell>
                                                <TableCell>{invoice.expenseType}</TableCell>
                                                <TableCell className="text-right">{invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                                                <TableCell>{invoice.cpRef}</TableCell>
                                                <TableCell>{services.find(s => s.id === invoice.service)?.name || invoice.service}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn("text-white", statusColors[invoice.status])} variant="default">{invoice.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.status === 'Mandatée' ? 0 : differenceInDays(today, invoice.depositDate)} jours
                                                </TableCell>
                                                {currentUser.role === 'FINANCES' && (
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center items-center gap-2">
                                                            { (invoice.status === 'Mandatée' || invoice.status === 'Traité') && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" onClick={() => handleRevertClick(invoice)}>
                                                                            <Undo2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Remettre "À mandater"</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            { (invoice.status === 'Rejeté CP' || invoice.status === 'Rejeté Service') && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" onClick={() => markInvoiceAsTraite(invoice.id)}>
                                                                            <CheckCheck className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Marquer comme "Traité"</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={currentUser.role === 'FINANCES' ? 9 : 8} className="h-24 text-center">
                                                Aucune facture ne correspond à vos filtres.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={isRevertDialogOpen} onOpenChange={setIsRevertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer l'action</AlertDialogTitle>
                        <AlertDialogDescription>
                            Pour remettre la facture "{selectedInvoiceForRevert?.fileName}" au statut "À mandater", veuillez saisir le mot de passe de confirmation.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={revertPassword}
                            onChange={(e) => setRevertPassword(e.target.value)}
                            placeholder="•••••"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedInvoiceForRevert(null)}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRevertConfirm}>Confirmer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>
    );
}
