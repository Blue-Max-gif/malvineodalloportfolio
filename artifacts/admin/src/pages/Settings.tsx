import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck, LogOut } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Settings() {
  const { toast } = useToast();

  const [currentKey, setCurrentKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleChangeKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKey || !newKey || !confirmKey) return;
    if (newKey !== confirmKey) {
      toast({ title: "Keys don't match", description: "New key and confirmation must match.", variant: "destructive" });
      return;
    }
    if (newKey.length < 6) {
      toast({ title: "Key too short", description: "Admin key must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/key", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentKey, newKey }),
      });
      const data = await res.json() as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        toast({ title: "Admin key updated", description: "Your new key is active. You'll need it next time you log in." });
        setCurrentKey("");
        setNewKey("");
        setConfirmKey("");
      } else {
        toast({ title: "Update failed", description: data.message ?? "Could not update the admin key.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Could not connect to server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    window.location.href = "/";
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your admin access and security settings.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle>Change Admin Key</CardTitle>
          </div>
          <CardDescription>
            Update your admin key. You'll need the current key to make changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeKey} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Key</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={currentKey}
                  onChange={(e) => setCurrentKey(e.target.value)}
                  placeholder="Enter current admin key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>New Key</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Enter new admin key (min. 6 characters)"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirm New Key</Label>
              <Input
                type="password"
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
                placeholder="Re-enter new admin key"
              />
            </div>

            {newKey && confirmKey && newKey !== confirmKey && (
              <p className="text-sm text-destructive">Keys don't match</p>
            )}
            {newKey && newKey.length > 0 && newKey.length < 6 && (
              <p className="text-sm text-destructive">Key must be at least 6 characters</p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="submit"
                disabled={!currentKey || !newKey || !confirmKey || newKey !== confirmKey || newKey.length < 6 || loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating…</>
                ) : (
                  <><ShieldCheck className="mr-2 h-4 w-4" />Update Key</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" />
            <CardTitle>Sign Out</CardTitle>
          </div>
          <CardDescription>End your current admin session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setLogoutDialogOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of admin?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need your admin key to get back in. You'll be redirected to the portfolio homepage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
