"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useApp } from "./app-provider";
import { FullScreenToggle } from "./full-screen-toggle";
import { UserNav } from "./user-nav";

export default function AppHeader() {
  const { currentUser } = useApp();
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden"/>
        <h1 className="text-xl font-semibold font-headline">{currentUser?.name}</h1>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <FullScreenToggle />
        <UserNav />
      </div>
    </header>
  );
}
