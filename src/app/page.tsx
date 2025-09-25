
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Lock, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useApp } from "@/components/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  service: z.string().min(1, { message: "Veuillez sélectionner un service." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export default function LoginPage() {
  const { login, services } = useApp();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      password: "",
    },
  });

  const orderedServices = React.useMemo(() => {
    const specialServices = ['FINANCES', 'COMMANDE PUBLIQUE'];
    const special = services.filter(s => specialServices.includes(s.id));
    const others = services
      .filter(s => !specialServices.includes(s.id))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...special, ...others];
  }, [services]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const success = login(values.service, values.password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Mot de passe incorrect.");
      form.setError("password", { type: "manual", message: "Mot de passe incorrect." });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">FactureTrack</CardTitle>
          <CardDescription>Suivi des Factures</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Sélectionnez votre service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {orderedServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name.replace('SG - ', '')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input className="pl-10" type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {error && !form.formState.errors.password && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                <LogIn className="mr-2 h-5 w-5" />
                Se connecter
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
