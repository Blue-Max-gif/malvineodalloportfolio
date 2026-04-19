import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Monitor, Heart, Users, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const skills = [
  { name: "Graphic Design", icon: Palette, color: "text-pink-500" },
  { name: "ICT Skills", icon: Monitor, color: "text-blue-500" },
  { name: "Certified First Aider", icon: Heart, color: "text-red-500" },
  { name: "Leadership & Governance", icon: Users, color: "text-indigo-500" },
  { name: "Mentorship & Capacity Building", icon: GraduationCap, color: "text-emerald-500" },
];

export default function Skills() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Skills</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full group hover:border-primary/50 transition-colors bg-card/50 backdrop-blur overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 flex flex-col items-center text-center gap-4 relative z-10">
                  <div className={`p-4 rounded-full bg-background border shadow-sm ${skill.color}`}>
                    <skill.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg">{skill.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
