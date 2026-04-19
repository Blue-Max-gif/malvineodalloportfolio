import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";

const goals = [
  "Become a transformative leader in community impact",
  "Expand Uplift Society nationally",
  "Advance studies in Forensic Science",
  "Work in leadership, governance, and policy",
  "Build strong professional networks",
  "Advocate for youth and student empowerment",
  "Improve strategic planning and project management skills",
  "Mentor young leaders",
  "Build a career based on integrity, service, and impact"
];

export default function Goals() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Future Goals</h1>
        
        <div className="grid gap-4">
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/50 backdrop-blur hover:bg-accent transition-colors group border-border/50">
                <CardContent className="p-6 flex items-center gap-4">
                  <Target className="w-5 h-5 text-primary shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-medium">{goal}</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
