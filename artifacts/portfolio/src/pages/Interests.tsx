import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Users, Globe2 } from "lucide-react";

const interests = [
  { title: "Leadership & Governance", icon: Users },
  { title: "Mentorship & Capacity Building", icon: HeartHandshake },
  { title: "Forensic Science & Investigation", icon: ShieldCheck },
  { title: "Community Development", icon: Globe2 },
];

export default function Interests() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Interests</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interests.map((interest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8 flex items-center gap-6 relative z-10">
                  <div className="p-4 rounded-full bg-background border shadow-sm text-primary group-hover:scale-110 transition-transform">
                    <interest.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{interest.title}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
