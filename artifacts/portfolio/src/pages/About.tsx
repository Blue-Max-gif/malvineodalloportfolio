import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProfile } from "@workspace/api-client-react";

export default function About() {
  const { data: profile, isLoading } = useGetProfile();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">About Me</h1>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-8">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 rounded bg-muted animate-pulse w-full" />
                <div className="h-4 rounded bg-muted animate-pulse w-5/6" />
                <div className="h-4 rounded bg-muted animate-pulse w-4/6" />
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                {profile?.aboutText}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
