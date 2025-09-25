
"use client";

import * as React from "react";
import { useApp } from "@/components/app-provider";
import type { Invoice } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Banknote } from "lucide-react";

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

const StatCard = ({ title, stats }: { title: string, stats: { label: string, value: number }[] }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-xl text-blue-400">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {stats.map((stat, index) => (
                <div key={index}>
                    <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">{stat.label}</p>
                        <p className="font-semibold">{formatCurrency(stat.value)}</p>
                    </div>
                    {index < stats.length -1 && <Separator className="mt-2" />}
                </div>
            ))}
        </CardContent>
    </Card>
);

export default function StatsPage() {
    const { currentUser, invoices } = useApp();

    const statsData = React.useMemo(() => {
        const mandatedInvoices = invoices.filter(inv => ['Mandatée', 'Traité'].includes(inv.status));

        const calculateStats = (filteredInvoices: Invoice[]) => {
            const total = filteredInvoices.reduce((acc, inv) => acc + inv.amount, 0);
            const fonctionnement = filteredInvoices.filter(i => i.expenseType === 'Fonctionnement').reduce((acc, inv) => acc + inv.amount, 0);
            const fluide = filteredInvoices.filter(i => i.expenseType === 'Fluide').reduce((acc, inv) => acc + inv.amount, 0);
            const investissement = filteredInvoices.filter(i => i.expenseType === 'Investissement').reduce((acc, inv) => acc + inv.amount, 0);
            return [
                { label: 'Total des mandats', value: total },
                { label: 'Total Fonctionnement', value: fonctionnement },
                { label: 'Total Fluide', value: fluide },
                { label: 'Total Investissement', value: investissement },
            ];
        };

        const ccasServices = ['CCAS', 'SAAD'];
        const dreServices = ['DRE'];
        const otherServices = invoices
            .map(i => i.service)
            .filter(s => !ccasServices.includes(s) && !dreServices.includes(s));

        const ccasInvoices = mandatedInvoices.filter(inv => ccasServices.includes(inv.service));
        const dreInvoices = mandatedInvoices.filter(inv => dreServices.includes(inv.service));
        const othersInvoices = mandatedInvoices.filter(inv => otherServices.includes(inv.service));

        return {
            ccas: calculateStats(ccasInvoices),
            dre: calculateStats(dreInvoices),
            others: calculateStats(othersInvoices),
        };

    }, [invoices]);


    if (!currentUser || currentUser.role !== 'FINANCES') {
        return (
            <div className="flex h-full items-center justify-center">
                <p>Vous n'avez pas l'autorisation d'accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Banknote className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle className="text-2xl font-headline">Statistiques Financières</CardTitle>
                            <CardDescription>Analyse des dépenses mandatées par service.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="CCAS" stats={statsData.ccas} />
                <StatCard title="DRE" stats={statsData.dre} />
                <StatCard title="Autres Services" stats={statsData.others} />
            </div>
        </div>
    );
}
