import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Zap, Heart, Trophy } from "lucide-react";
import { SaveButton } from "@/components/SaveButton";

const CATEGORIES = [
  { value: "strengths", label: "Key Strengths", icon: Zap, color: "text-blue-500" },
  { value: "hobbies", label: "Hobbies & Interests", icon: Heart, color: "text-pink-500" },
  { value: "achievements", label: "Additional Achievements", icon: Trophy, color: "text-amber-500" },
];

interface HighlightItem {
  id: number;
  category: string;
  content: string;
  sortOrder: number;
}

function useHighlights() {
  return useQuery<HighlightItem[]>({
    queryKey: ["highlights"],
    queryFn: async () => {
      const res = await fetch("/api/highlights");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
}

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  initial?: HighlightItem;
  defaultCategory?: string;
}

function ItemForm({ open, onClose, initial, defaultCategory }: ItemFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? defaultCategory ?? "strengths");

  const mutation = useMutation({
    mutationFn: async () => {
      const url = initial ? `/api/highlights/${initial.id}` : "/api/highlights";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, content: content.trim(), sortOrder: initial?.sortOrder ?? 0 }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      toast({ title: initial ? "Item updated" : "Item added" });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Could not save item.", variant: "destructive" }),
  });

  React.useEffect(() => {
    if (open) {
      setContent(initial?.content ?? "");
      setCategory(initial?.category ?? defaultCategory ?? "strengths");
    }
  }, [open, initial, defaultCategory]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={!!initial}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter item text..."
              onKeyDown={(e) => e.key === "Enter" && content.trim() && mutation.mutate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={!content.trim() || mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initial ? "Save Changes" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Highlights() {
  const { data: items, isLoading } = useHighlights();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HighlightItem | undefined>(undefined);
  const [addingCategory, setAddingCategory] = useState<string>("strengths");

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/highlights/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      toast({ title: "Item deleted" });
    },
    onError: () => toast({ title: "Error", description: "Could not delete item.", variant: "destructive" }),
  });

  const openAdd = (cat: string) => {
    setEditing(undefined);
    setAddingCategory(cat);
    setFormOpen(true);
  };

  const openEdit = (item: HighlightItem) => {
    setEditing(item);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Highlights</h1>
          <p className="text-muted-foreground mt-2">
            Manage your key strengths, hobbies, and additional achievements.
          </p>
        </div>
        <SaveButton
          isPending={deleteMutation.isPending}
          isSaved={deleteMutation.isSuccess}
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["highlights"] });
            toast({ title: "✓ Changes saved", description: "All highlights are up to date." });
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map(({ value, label, icon: Icon, color }) => {
            const categoryItems = (items ?? []).filter((i) => i.category === value);
            return (
              <Card key={value}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <div>
                      <CardTitle className="text-lg">{label}</CardTitle>
                      <CardDescription>{categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}</CardDescription>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => openAdd(value)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </CardHeader>
                <CardContent>
                  {categoryItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                      No items yet — click Add to get started.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {categoryItems.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">✓</span>
                          <span className="flex-1 text-sm">{item.content}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ItemForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(undefined); }}
        initial={editing}
        defaultCategory={addingCategory}
      />
    </div>
  );
}
