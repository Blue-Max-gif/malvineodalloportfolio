import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen } from "lucide-react";

const education = [
  {
    institution: "Kirinyaga University",
    degree: "BSc Forensic Science",
    period: "2024–2028, Ongoing",
    icon: GraduationCap,
  },
  {
    institution: "Thurdibuoro Secondary School",
    degree: "KCSE — Grade B",
    period: "2023",
    icon: BookOpen,
  },
  {
    institution: "Faith Baptist Academy",
    degree: "KCPE — 376 Marks",
    period: "2019",
    icon: BookOpen,
  },
  {
    institution: "St John Ambulance",
    degree: "Certification: First Aid",
    period: "",
    icon: Award,
  }
];

export default function Education() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Education</h1>
        
        <div className="grid gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur hover:border-primary/50 transition-all group">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <edu.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{edu.institution}</h3>
                    <p className="text-primary font-medium">{edu.degree}</p>
                    {edu.period && <p className="text-sm text-muted-foreground mt-1">{edu.period}</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
