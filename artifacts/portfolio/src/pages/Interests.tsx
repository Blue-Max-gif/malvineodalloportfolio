import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Users, Globe2, Star } from "lucide-react";
import { useListInterests } from "@workspace/api-client-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  ShieldCheck,
  HeartHandshake,
  Users,
  Globe2,
  Star,
};

export default function Interests() {
  const { data: interests = [], isLoading } = useListInterests();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Interests</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interests.map((interest, index) => {
              const Icon = interest.icon && iconMap[interest.icon] ? iconMap[interest.icon] : Star;
              return (
                <motion.div
                  key={interest.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-8 flex items-center gap-6 relative z-10">
                      <div className="p-4 rounded-full bg-background border shadow-sm text-primary group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold">{interest.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
