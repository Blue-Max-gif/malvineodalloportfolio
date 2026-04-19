import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";
import { useListGoals } from "@workspace/api-client-react";

export default function Goals() {
  const { data: goals = [], isLoading } = useListGoals();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Future Goals</h1>

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-card/50 backdrop-blur hover:bg-accent transition-colors group border-border/50">
                  <CardContent className="p-6 flex items-center gap-4">
                    <Target className="w-5 h-5 text-primary shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg font-medium">{goal.content}</span>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
