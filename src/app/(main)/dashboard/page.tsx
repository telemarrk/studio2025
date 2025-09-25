
"use client";

import * as React from "react";
import { useApp } from "@/components/app-provider";
import type { Invoice, InvoiceStatus, Comment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, FilePen, Send, Hourglass, Banknote, Building, FileText, Eye, MessageSquare, FileUp, FileDown, RefreshCw } from "lucide-react";
import { format, differenceInDays } from "date-fns";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";


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


const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const CommentsSheet: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const { addComment } = useApp();
    const [newComment, setNewComment] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSubmit = () => {
        if (newComment.trim()) {
            addComment(invoice.id, newComment.trim());
            setNewComment("");
            setIsOpen(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
             <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                         <Button size="icon" variant="ghost" className="relative h-9 w-9">
                            <MessageSquare className="h-4 w-4" />
                            {invoice.comments.length > 0 && (
                                <Badge className="absolute -top-1 -right-2 h-4 w-4 justify-center rounded-full p-0 text-xs">
                                    {invoice.comments.length}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Commentaires ({invoice.comments.length})</p></TooltipContent>
            </Tooltip>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Commentaires</SheetTitle>
                    <SheetDescription>
                        Échanges concernant la facture {invoice.fileName}.
                    </SheetDescription>
                </SheetHeader>
                 <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                        {invoice.comments.length > 0 ? (
                            invoice.comments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{getInitials(comment.user)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 rounded-md bg-muted p-3 text-sm">
                                        <p className="font-semibold">{comment.user}</p>
                                        <p className="text-muted-foreground">{comment.text}</p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            {format(new Date(comment.timestamp), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground py-8">Aucun commentaire pour le moment.</p>
                        )}
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto pt-4 border-t">
                     <div className="w-full space-y-2">
                        <Label htmlFor="comment" className="sr-only">Nouveau commentaire</Label>
                        <Textarea id="comment" placeholder="Ajouter un commentaire..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                        <div className="flex justify-end gap-2">
                            <SheetClose asChild>
                                <Button variant="outline">Annuler</Button>
                            </SheetClose>
                            <Button onClick={handleSubmit} disabled={!newComment.trim()}>Envoyer</Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};


const RoleSpecificActions: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const { currentUser, updateInvoiceStatus } = useApp();
    const [comment, setComment] = React.useState('');

    if (!currentUser) return null;

    const renderRejectDialog = (status: 'Rejeté CP' | 'Rejeté Service' | 'Rejeté Finances') => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive" className="h-8 w-8"><X className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Motif du rejet</AlertDialogTitle></AlertDialogHeader>
                <Textarea placeholder="Expliquez pourquoi la facture est rejetée..." value={comment} onChange={e => setComment(e.target.value)} />
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => updateInvoiceStatus(invoice.id, status, comment)} disabled={!comment}>Confirmer le rejet</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    const renderActions = () => {
        switch (currentUser.role) {
            case 'COMMANDE PUBLIQUE':
                if (invoice.status === 'À traiter' && invoice.service !== 'SGCOMPUB') { // Standard CP validation
                    return (
                        <>
                            <Button size="icon" className="h-8 w-8" onClick={() => updateInvoiceStatus(invoice.id, 'Validé CP')}>
                                <Check className="h-4 w-4" />
                            </Button>
                            {renderRejectDialog('Rejeté CP')}
                        </>
                    );
                }
                if (invoice.service === 'SGCOMPUB') {
                    if (invoice.status === 'À traiter') { // First CP validation (as CP)
                         return (
                            <>
                                <Button size="icon" className="h-8 w-8" onClick={() => updateInvoiceStatus(invoice.id, 'Validé CP')}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                {renderRejectDialog('Rejeté CP')}
                            </>
                        );
                    }
                    if (invoice.status === 'Validé CP') { // Second CP validation (as Service)
                        return (
                            <>
                                <Button size="icon" className="h-8 w-8" onClick={() => updateInvoiceStatus(invoice.id, 'À mandater')}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                {renderRejectDialog('Rejeté Service')}
                            </>
                        );
                    }
                }
                break;
            case 'SERVICE':
                 if ((invoice.status === 'Validé CP' || (['CCAS', 'SAAD', 'DRE'].includes(currentUser.id) && invoice.status === 'À traiter')) && invoice.status !== 'Rejeté Service') {
                    return (
                        <>
                            <Button size="icon" className="h-8 w-8" onClick={() => updateInvoiceStatus(invoice.id, 'À mandater')}>
                                <Check className="h-4 w-4" />
                            </Button>
                            {renderRejectDialog('Rejeté Service')}
                        </>
                    );
                }
                break;
            case 'FINANCES':
                if (invoice.status === 'À mandater') {
                     return (
                        <>
                            <Button size="icon" className="h-8 w-8" onClick={() => updateInvoiceStatus(invoice.id, 'Mandatée')}>
                                <Check className="h-4 w-4" />
                            </Button>
                            {renderRejectDialog('Rejeté Finances')}
                        </>
                    );
                }
                if (invoice.service === 'SGFINANCES' && invoice.status === 'À traiter') {
                    return (
                        <>
                            <Button size="icon" className="h-8 w-8" onClick={() => updateInvoiceStatus(invoice.id, 'À mandater')}>
                                <Check className="h-4 w-4" />
                            </Button>
                            {renderRejectDialog('Rejeté Service')}
                        </>
                    );
                }
                break;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-9 w-9">
                        <Eye className="h-4 w-4 text-accent" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Visualiser</p></TooltipContent>
            </Tooltip>
            <CommentsSheet invoice={invoice} />
            {renderActions()}
        </div>
    );
};

const CpRefCell: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const { currentUser, updateInvoiceCpRef } = useApp();
    const [cpRef, setCpRef] = React.useState(invoice.cpRef);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleCpRefUpdate = () => {
        updateInvoiceCpRef(invoice.id, cpRef);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCpRefUpdate();
            setIsPopoverOpen(false);
            e.preventDefault();
        }
    };

    const canEdit = currentUser?.role === 'COMMANDE PUBLIQUE' && invoice.status === 'À traiter';

    return (
        <div className="flex items-center gap-2">
            <span>{invoice.cpRef}</span>
            {canEdit && (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7">
                                    <FilePen className="h-4 w-4 text-accent" />
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Saisir/Modifier Réf. CP</p></TooltipContent>
                    </Tooltip>
                    <PopoverContent className="w-48 p-2">
                        <Input
                            placeholder="Réf. CP"
                            value={cpRef}
                            onChange={(e) => setCpRef(e.target.value)}
                            maxLength={14}
                            onKeyDown={handleKeyDown}
                            className="h-9"
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};


export default function DashboardPage() {
    const { currentUser, invoices, services, refreshData } = useApp();
    const [today, setToday] = React.useState(new Date());

    const serviceManagementMap: { [key: string]: string[] } = {
        'SGMULTIACC': ['SGRAM'],
        'SGDG': ['SGELUS'],
        'SGJURID': ['SGAFP'],
        'SGST': ['SGGDSTRAV', 'SGENTRET'],
        'SGCOMMUNIC': ['SGRECPT'],
        'CCAS': ['SAAD'],
        'SGRESTO': ['SGREPDOM'],
    };

    React.useEffect(() => {
        const timer = setInterval(() => {
            setToday(new Date());
        }, 1000 * 60 * 60 * 24); // Update once a day
        return () => clearInterval(timer);
    }, []);

    const invoicesForUser = React.useMemo(() => {
        if (!currentUser) return [];

        const specialServices = ['CCAS', 'SAAD', 'DRE'];
        const excludedForCP = ['CCAS', 'SAAD', 'DRE', 'SGFINANCES'];

        switch (currentUser.role) {
            case 'FINANCES':
                return invoices.filter(inv => 
                    inv.status === 'À mandater' || 
                    (inv.service === 'SGFINANCES' && inv.status === 'À traiter')
                );
            case 'COMMANDE PUBLIQUE':
                return invoices.filter(inv => {
                    if (excludedForCP.includes(inv.service)) {
                        return false;
                    }
                    if (inv.service === 'SGCOMPUB') {
                        return inv.status === 'À traiter' || inv.status === 'Validé CP';
                    }
                    return inv.status === 'À traiter';
                });
            case 'SERVICE':
                const managedServices = [currentUser.id, ...(serviceManagementMap[currentUser.id] || [])];
                
                if (specialServices.includes(currentUser.id)) {
                    return invoices.filter(inv => managedServices.includes(inv.service) && inv.status === 'À traiter');
                }
                return invoices.filter(inv => managedServices.includes(inv.service) && inv.status === 'Validé CP' && inv.status !== 'Rejeté Service');
            default:
                return [];
        }
    }, [currentUser, invoices, serviceManagementMap]);

    const stats = React.useMemo(() => {
        if (!currentUser) return {};
        
        const specialServices = ['CCAS', 'SAAD', 'DRE'];
        
        switch (currentUser.role) {
            case 'COMMANDE PUBLIQUE':
                const cpInvoices = invoices.filter(inv => (inv.status === 'À traiter' && !specialServices.includes(inv.service)) || inv.service === 'COMMANDE PUBLIQUE');
                return {
                    'À Traiter': cpInvoices.length,
                    'Factures rejetées par la CP': invoices.filter(i => i.status === 'Rejeté CP').length,
                    'Factures Rejetées par les services': invoices.filter(i => i.status === 'Rejeté Service').length,
                };
            case 'FINANCES':
                 const financeInvoices = invoices.filter(inv => inv.status === 'À mandater');
                return {
                    'Factures à Mandater': financeInvoices.length,
                    'Fonctionnement': financeInvoices.filter(i => i.expenseType === 'Fonctionnement').length,
                    'Fluide': financeInvoices.filter(i => i.expenseType === 'Fluide').length,
                    'Investissement': financeInvoices.filter(i => i.expenseType === 'Investissement').length,
                    'Rejet CP': invoices.filter(i => i.status === 'Rejeté CP').length,
                    'Rejet Services': invoices.filter(i => i.status === 'Rejeté Service').length,
                };
            case 'SERVICE':
                 const managedServices = [currentUser.id, ...(serviceManagementMap[currentUser.id] || [])];
                 const serviceInvoices = invoices.filter(inv => managedServices.includes(inv.service) && inv.status !== 'Rejeté Service');
                return {
                    'Total Factures': serviceInvoices.length,
                };
            default: 
                return {};
        }
    }, [currentUser, invoices, serviceManagementMap]);
    
    const statIcons: {[key: string]: React.ElementType} = {
        'À Traiter': Hourglass,
        'Factures rejetées par la CP': FileDown,
        'Factures Rejetées par les services': FileDown,
        'Factures à Mandater': Send,
        'Fonctionnement': FileText,
        'Fluide': FileText,
        'Investissement': FileText,
        'Rejet CP': X,
        'Rejet Services': X,
        'Total Factures': FileText,
        'À traiter': Hourglass,
        'Rejetées': X,
    }


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
    const showRefreshButton = ['FINANCES', 'COMMANDE PUBLIQUE'].includes(currentUser.role);

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <RoleIcon className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl font-headline">Tableau de bord</CardTitle>
                                    <CardDescription>Factures nécessitant votre attention</CardDescription>
                                </div>
                            </div>
                            {showRefreshButton && (
                                <Button onClick={refreshData}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Actualiser
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(stats).map(([title, value]) => {
                                const Icon = statIcons[title] || FileText;
                                return (
                                    <Card key={title}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">{title}</CardTitle>
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{value}</div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
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
                                        <TableHead>Date de dépôt</TableHead>
                                        <TableHead>Type de dépenses</TableHead>
                                        <TableHead className="text-right">Montant TTC</TableHead>
                                        <TableHead>Réf. CP</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Échéance</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoicesForUser.length > 0 ? (
                                        invoicesForUser.map((invoice) => (
                                            <TableRow key={invoice.id} className={invoice.isInvalid ? 'bg-red-900/20' : ''}>
                                                <TableCell className="font-medium">{invoice.fileName}</TableCell>
                                                <TableCell>{format(invoice.depositDate, 'dd/MM/yyyy', { locale: fr })}</TableCell>
                                                <TableCell>{invoice.expenseType}</TableCell>
                                                <TableCell className="text-right">{invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                                                <TableCell>
                                                    <CpRefCell invoice={invoice} />
                                                </TableCell>
                                                <TableCell>{services.find(s => s.id === invoice.service)?.designation || invoice.service}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn("text-white", statusColors[invoice.status])} variant="default">{invoice.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.status === 'Mandatée' ? 0 : differenceInDays(today, invoice.depositDate)} jours
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
                                            <TableCell colSpan={9} className="h-24 text-center">
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
        </TooltipProvider>
    );
}

    

    

    
