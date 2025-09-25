"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useApp } from "./app-provider";
import { FullScreenToggle } from "./full-screen-toggle";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function AppHeader() {
  const { currentUser, logout } = useApp();
  
  const showSidebarTrigger = currentUser?.role === 'FINANCES' || currentUser?.role === 'COMMANDE PUBLIQUE';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className={!showSidebarTrigger ? 'md:hidden' : ''} />
        <h1 className="text-xl font-semibold font-headline">{currentUser?.name}</h1>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <FullScreenToggle />
        <TooltipProvider>
           <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={logout}>
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Déconnexion</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Déconnexion</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <UserNav />
      </div>
    </header>
  );
}
