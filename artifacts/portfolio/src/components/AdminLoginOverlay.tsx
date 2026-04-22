import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

function useAdminTrigger() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const params = new URLSearchParams(window.location.search);
      setShow(params.get("admin") === "true");
    };
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, []);

  return show;
}

export default function AdminLoginOverlay() {
  const show = useAdminTrigger();
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });
      const data = await res.json() as { valid: boolean };
      if (data.valid) {
        setSuccess(true);
        sessionStorage.setItem("adminAuth", "authenticated");
        setTimeout(() => {
          window.location.href = "/admin/";
        }, 800);
      } else {
        setError("Incorrect admin key. Please try again.");
        setKey("");
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("admin");
    window.history.replaceState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border-b border-border px-6 py-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground">Admin Access</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter your admin key to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {success ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-green-500 font-medium text-sm">Access granted — redirecting…</p>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={key}
                      onChange={(e) => { setKey(e.target.value); setError(""); }}
                      placeholder="Enter admin key"
                      autoFocus
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                  <button
                    type="submit"
                    disabled={!key.trim() || loading}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Verifying…" : "Enter Admin"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
