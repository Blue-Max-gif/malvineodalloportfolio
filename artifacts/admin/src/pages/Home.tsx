import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { User, Wrench, Briefcase, GraduationCap, Heart, Target, Contact } from "lucide-react";

export default function Home() {
  const { data: stats, isLoading } = useGetDashboardStats();

  const statCards = [
    { name: "Skills", count: stats?.skillsCount, icon: Wrench, href: "/skills" },
    { name: "Experience", count: stats?.experienceCount, icon: Briefcase, href: "/experience" },
    { name: "Education", count: stats?.educationCount, icon: GraduationCap, href: "/education" },
    { name: "Interests", count: stats?.interestsCount, icon: Heart, href: "/interests" },
    { name: "Goals", count: stats?.goalsCount, icon: Target, href: "/goals" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Manage your portfolio content. Select a section below to make updates.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/profile" className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl">
          <Card className="hover-elevate cursor-pointer transition-colors hover:border-primary/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Personal Info</div>
              {isLoading ? (
                <Skeleton className="h-4 w-24 mt-1" />
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Photo: {stats?.hasProfilePhoto ? "Yes" : "No"} | CV: {stats?.hasCv ? "Yes" : "No"}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link href="/contact" className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl">
          <Card className="hover-elevate cursor-pointer transition-colors hover:border-primary/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact</CardTitle>
              <Contact className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Details</div>
              <p className="text-xs text-muted-foreground mt-1">
                Manage how people reach you
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">Content Sections</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link key={card.name} href={card.href} className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl">
            <Card className="hover-elevate cursor-pointer transition-colors hover:border-primary/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.name}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{card.count ?? 0} items</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Click to manage
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
