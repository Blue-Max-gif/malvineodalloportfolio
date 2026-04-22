import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Wrench, Briefcase, GraduationCap, Heart, Target, Contact, Inbox, Star, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const baseNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Skills", href: "/skills", icon: Wrench },
  { name: "Experience", href: "/experience", icon: Briefcase },
  { name: "Education", href: "/education", icon: GraduationCap },
  { name: "Interests", href: "/interests", icon: Heart },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Highlights", href: "/highlights", icon: Star },
  { name: "Contact", href: "/contact", icon: Contact },
  { name: "Messages", href: "/messages", icon: Inbox },
  { name: "Settings", href: "/settings", icon: Settings },
];

function useUnreadCount() {
  const { data } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const res = await fetch("/api/contact/messages/unread-count");
      if (!res.ok) return { unreadCount: 0 };
      return res.json() as Promise<{ unreadCount: number }>;
    },
    refetchInterval: 30000,
  });
  return data?.unreadCount ?? 0;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const unreadCount = useUnreadCount();

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <span className="text-lg font-bold text-sidebar-foreground">Portfolio Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {baseNav.map((item) => {
              const isActive = location === item.href;
              const badge = item.name === "Messages" && unreadCount > 0 ? unreadCount : null;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 -ml-1 mr-3 h-5 w-5",
                      isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate flex-1">{item.name}</span>
                  {badge && (
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
