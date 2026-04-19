import { PageTransition } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Zap, Heart, Trophy } from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  accent: string;
  items: string[];
}

function Section({ icon, title, accent, items }: SectionProps) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${accent}`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex flex-col gap-3"
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={fadeUp}
            className="flex items-start gap-3 p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur hover:border-primary/30 hover:bg-card/80 transition-colors"
          >
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">✓</span>
            <span className="text-base text-foreground/90">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

const sections: SectionProps[] = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Key Strengths",
    accent: "bg-blue-500",
    items: [
      "Strategic thinking",
      "Team leadership",
      "Initiative and self-drive",
      "Problem-solving",
    ],
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Hobbies & Interests",
    accent: "bg-pink-500",
    items: [
      "Reading — especially leadership, governance, and social impact content",
      "Public speaking and debate",
      "Community service",
      "Networking and youth engagement",
    ],
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Additional Achievements",
    accent: "bg-amber-500",
    items: [
      "Listed among the best student leaders in Thurdibuoro's history",
      "Global Leadership Summit inductee",
      "Patron's Impact Award — Pathway to Potential",
      "Recognised by the Social Justice League for exemplary leadership",
    ],
  },
];

export default function Highlights() {
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
          {sections.map((section) => (
            <Section key={section.title} {...section} />
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
