"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HardHat, History, Home, Briefcase, FileText } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useApp } from "./app-provider";

export default function AppSidebar() {
  const pathname = usePathname();
  const { currentUser } = useApp();

  const menuItems = [
    { href: "/dashboard", label: "Tableau de bord", icon: Home, roles: ["FINANCES", "COMMANDE PUBLIQUE", "SERVICE"] },
    { href: "/history", label: "Historique", icon: History, roles: ["FINANCES", "COMMANDE PUBLIQUE"] },
    { href: "/services", label: "Gérer les services", icon: Briefcase, roles: ["FINANCES"] },
  ];
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <FileText className="w-8 h-8 text-primary"/>
            <h2 className="text-2xl font-bold font-headline">FactureTrack</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            currentUser && item.roles.includes(currentUser.role) && (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{children: item.label}}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
