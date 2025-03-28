"use client";

import { useState, useEffect } from "react";
import { Calendar, Home, Inbox, Search, Settings, Pencil, UserRoundPen } from "lucide-react";
import Cookies from "js-cookie";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "White Board",
    url: "/white-board",
    icon: Pencil,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserRoundPen,
  },
];

export function AppSidebar() {
 const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("jwt_token");
      setVisible(!!token && token !== "undefined");
    };

    checkToken(); // Check token on mount

    const interval = setInterval(checkToken, 1000); // Polling every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (!visible) return null;
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" /> {/* Properly sized icon */}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;