"use client";

import * as React from "react";
import { useApp } from "@/components/app-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Service } from "@/lib/types";

const ServiceForm = ({ service, onSave, onCancel }: { service?: Service | null, onSave: (service: Omit<Service, 'id'> | Service) => void, onCancel: () => void }) => {
    const [name, setName] = React.useState(service?.name || '');
    const [designation, setDesignation] = React.useState(service?.designation || '');
    const [password, setPassword] = React.useState(service?.password || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const serviceData = { name, designation, password };
        if (service) {
            onSave({ ...service, ...serviceData });
        } else {
            onSave(serviceData);
        }
    };

    const isSpecialRole = service && ['FINANCES', 'COMMANDE PUBLIQUE'].includes(service.id);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nom du service</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required disabled={isSpecialRole} />
            </div>
            <div>
                <Label htmlFor="designation">Désignation</Label>
                <Input id="designation" value={designation} onChange={e => setDesignation(e.target.value)} required disabled={isSpecialRole} />
            </div>
             <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
            </div>
        </form>
    );
};


export default function ServicesPage() {
    const { services, addService, updateService, deleteService } = useApp();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState<Service | null>(null);
    
    const handleSave = (service: Omit<Service, 'id'> | Service) => {
        if ('id' in service) {
            updateService(service);
        } else {
            addService(service);
        }
        setIsDialogOpen(false);
        setSelectedService(null);
    };
    
    const openDialog = (service: Service | null = null) => {
        setSelectedService(service);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedService(null);
    }

    const servicesToDisplay = React.useMemo(() => {
        const excludedIds = ['SGFINANCES', 'SGCOMPUB'];
        return services.filter(service => !excludedIds.includes(service.id));
    }, [services]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-headline">Gérer les services</CardTitle>
                        <CardDescription>Ajoutez, modifiez ou supprimez des services.</CardDescription>
                    </div>
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => openDialog()}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un service
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedService ? "Modifier le service" : "Ajouter un service"}</DialogTitle>
                            </DialogHeader>
                            <ServiceForm service={selectedService} onSave={handleSave} onCancel={closeDialog} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Désignation</TableHead>
                                    <TableHead>Mot de passe</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {servicesToDisplay.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium">{service.name}</TableCell>
                                        <TableCell>{service.designation}</TableCell>
                                        <TableCell>••••••••</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog(service)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)} disabled={['FINANCES', 'COMMANDE PUBLIQUE'].includes(service.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
