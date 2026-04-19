import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Wrench, Briefcase, GraduationCap, Heart, Target, Contact } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Skills", href: "/skills", icon: Wrench },
  { name: "Experience", href: "/experience", icon: Briefcase },
  { name: "Education", href: "/education", icon: GraduationCap },
  { name: "Interests", href: "/interests", icon: Heart },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Contact", href: "/contact", icon: Contact },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <span className="text-lg font-bold text-sidebar-foreground">Portfolio Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location === item.href;
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
                  <span className="truncate">{item.name}</span>
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
