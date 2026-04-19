import { PageTransition } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Zap, Heart, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface HighlightItem {
  id: number;
  category: string;
  content: string;
  sortOrder: number;
}

const SECTIONS = [
  { key: "strengths", title: "Key Strengths", icon: <Zap className="w-5 h-5" />, accent: "bg-blue-500" },
  { key: "hobbies", title: "Hobbies & Interests", icon: <Heart className="w-5 h-5" />, accent: "bg-pink-500" },
  { key: "achievements", title: "Additional Achievements", icon: <Trophy className="w-5 h-5" />, accent: "bg-amber-500" },
];

const FALLBACK: Record<string, string[]> = {
  strengths: ["Strategic thinking", "Team leadership", "Initiative and self-drive", "Problem-solving"],
  hobbies: [
    "Reading — especially leadership, governance, and social impact content",
    "Public speaking and debate",
    "Community service",
    "Networking and youth engagement",
  ],
  achievements: [
    "Listed among the best student leaders in Thurdibuoro's history",
    "Global Leadership Summit inductee",
    "Patron's Impact Award — Pathway to Potential",
    "Recognised by the Social Justice League for exemplary leadership",
  ],
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Highlights() {
  const { data: items } = useQuery<HighlightItem[]>({
    queryKey: ["highlights"],
    queryFn: async () => {
      const res = await fetch("/api/highlights");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
            Highlights
          </h1>
          <p className="text-muted-foreground text-lg">
            Strengths, passions, and milestones that define the journey.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-14"
        >
          {SECTIONS.map(({ key, title, icon, accent }) => {
            const sectionItems = items
              ? items.filter((i) => i.category === key).map((i) => i.content)
              : FALLBACK[key];

            return (
              <motion.div key={key} variants={fadeUp} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${accent}`}>
                    {icon}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                </div>
                <motion.ul
                  key={sectionItems.join("|")}
                  variants={container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: "-60px" }}
                  className="flex flex-col gap-3"
                >
                  {sectionItems.map((text) => (
                    <motion.li
                      key={text}
                      variants={fadeUp}
                      className="flex items-start gap-3 p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur hover:border-primary/30 hover:bg-card/80 transition-colors"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">✓</span>
                      <span className="text-base text-foreground/90">{text}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </PageTransition>
  );
}
