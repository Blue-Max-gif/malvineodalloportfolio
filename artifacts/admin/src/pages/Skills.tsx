import React, { useState } from "react";
import { useListSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, getListSkillsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { SaveButton } from "@/components/SaveButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon name is required"),
  sortOrder: z.coerce.number().int().default(0),
});

type SkillFormValues = z.infer<typeof skillSchema>;

export default function Skills() {
  const { data: skills = [], isLoading } = useListSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      icon: "",
      sortOrder: 0,
    },
  });

  const handleOpenDialog = (skill?: any) => {
    if (skill) {
      setEditingId(skill.id);
      form.reset({
        name: skill.name,
        icon: skill.icon,
        sortOrder: skill.sortOrder,
      });
    } else {
      setEditingId(null);
      form.reset({
        name: "",
        icon: "",
        sortOrder: skills.length > 0 ? Math.max(...skills.map((s) => s.sortOrder)) + 1 : 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      form.reset();
      setEditingId(null);
    }, 200);
  };

  const onSubmit = (data: SkillFormValues) => {
    if (editingId) {
      updateSkill.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
            toast({ title: "Skill updated" });
            handleCloseDialog();
          },
        }
      );
    } else {
      createSkill.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
            toast({ title: "Skill created" });
            handleCloseDialog();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteSkill.mutate(
      { id: deletingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
          toast({ title: "Skill deleted" });
          setIsDeleteDialogOpen(false);
          setDeletingId(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const sortedSkills = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-2">
            Manage the skills displayed on your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SaveButton
            isPending={createSkill.isPending || updateSkill.isPending || deleteSkill.isPending}
            isSaved={createSkill.isSuccess || updateSkill.isSuccess || deleteSkill.isSuccess}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
              toast({ title: "✓ Changes saved", description: "All skills are up to date." });
            }}
          />
          <Button onClick={() => handleOpenDialog()} data-testid="button-add-skill">
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedSkills.map((skill) => (
          <Card key={skill.id} className="group relative">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-mono text-muted-foreground" title={skill.icon}>
                  {skill.icon.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{skill.name}</h3>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 border">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => handleOpenDialog(skill)}
                  data-testid={`button-edit-skill-${skill.id}`}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                  onClick={() => {
                    setDeletingId(skill.id);
                    setIsDeleteDialogOpen(true);
                  }}
                  data-testid={`button-delete-skill-${skill.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {skills.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No skills added yet.</p>
            <Button variant="link" onClick={() => handleOpenDialog()} className="mt-2">
              Add your first skill
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="React, Python, Design..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Class</FormLabel>
                    <FormControl>
                      <Input placeholder="siReact, lucide-code..." {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Use a lucide-react or react-icons name.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createSkill.isPending || updateSkill.isPending}
                  data-testid="button-save-skill"
                >
                  {(createSkill.isPending || updateSkill.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this skill. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSkill.isPending}
            >
              {deleteSkill.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
