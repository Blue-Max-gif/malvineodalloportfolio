import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen } from "lucide-react";
import { useListEducation } from "@workspace/api-client-react";

export default function Education() {
  const { data: education = [], isLoading } = useListEducation();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Education</h1>

        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {education.map((edu, index) => {
              const Icon = index === 0 ? GraduationCap : index === education.length - 1 ? Award : BookOpen;
              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card/50 backdrop-blur hover:border-primary/50 transition-all group">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{edu.institution}</h3>
                        <p className="text-primary font-medium">{edu.degree}</p>
                        {edu.grade && <p className="text-sm text-muted-foreground mt-1">{edu.grade}</p>}
                        {edu.year && <p className="text-sm text-muted-foreground mt-1">{edu.year}</p>}
                      </div>
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
