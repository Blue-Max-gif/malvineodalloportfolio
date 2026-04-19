import { PageTransition } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetProfile } from "@workspace/api-client-react";

export default function Home() {
  const { data: profile } = useGetProfile();

  const profilePhotoUrl = profile?.profilePhotoPath
    ? `/api/storage${profile.profilePhotoPath}`
    : "/profile.png";

  const cvUrl = profile?.cvPath
    ? `/api/storage${profile.cvPath}`
    : "/Ochieng_Malvine_Odallo_CV.pdf";

  return (
    <PageTransition>
      <div className="min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-background shadow-2xl shadow-primary/20 relative"
          >
            <img src={profilePhotoUrl} alt={profile?.name ?? "Ochieng Malvine Odallo"} className="w-full h-full object-cover" />
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
            >
              {profile?.name?.toUpperCase().replace(/(\S+)\s+(\S+)\s+(.+)/, "$1 $2 ") || "OCHIENG MALVINE "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                {profile?.name?.split(" ").slice(-1)[0]?.toUpperCase() || "ODALLO"}
              </span>
            </motion.h1>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground font-medium"
            >
              {profile?.title ?? "Student Forensic Scientist | Student Leader"}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto italic"
            >
              "{profile?.tagline ?? "Driving community impact through leadership, service, and innovation."}"
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4"
          >
            <Link href="/about" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              View Portfolio
            </Link>
            <a href={cvUrl} download="Ochieng_Malvine_Odallo_CV.pdf" data-testid="button-download-cv" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Download CV
            </a>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
