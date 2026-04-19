import { motion, useScroll } from "framer-motion";
import { Navbar } from "./Navbar";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      
      <footer className="border-t border-border/50 py-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Ochieng Malvine Odallo. All rights reserved.</p>
      </footer>

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-50"
          data-testid="button-back-to-top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
