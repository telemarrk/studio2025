
"use client";

import React from "react";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar-nav";
import AppHeader from "@/components/header";
import { useApp } from "./app-provider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();

  if (currentUser?.role === 'SERVICE') {
    return (
      <div className="flex flex-col h-screen">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-full">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
