import React, { useState } from "react";
import { useListExperience, useCreateExperience, useUpdateExperience, useDeleteExperience, getListExperienceQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const experienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  organization: z.string().min(1, "Organization is required"),
  bullets: z.string().min(1, "At least one bullet point is required"),
  sortOrder: z.coerce.number().int().default(0),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export default function Experience() {
  const { data: experience = [], isLoading } = useListExperience();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      role: "",
      organization: "",
      bullets: "",
      sortOrder: 0,
    },
  });

  const handleOpenDialog = (exp?: any) => {
    if (exp) {
      setEditingId(exp.id);
      form.reset({
        role: exp.role,
        organization: exp.organization,
        bullets: exp.bullets,
        sortOrder: exp.sortOrder,
      });
    } else {
      setEditingId(null);
      form.reset({
        role: "",
        organization: "",
        bullets: "",
        sortOrder: experience.length > 0 ? Math.max(...experience.map((e) => e.sortOrder)) + 1 : 0,
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

  const onSubmit = (data: ExperienceFormValues) => {
    if (editingId) {
      updateExperience.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListExperienceQueryKey() });
            toast({ title: "Experience updated" });
            handleCloseDialog();
          },
        }
      );
    } else {
      createExperience.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListExperienceQueryKey() });
            toast({ title: "Experience created" });
            handleCloseDialog();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteExperience.mutate(
      { id: deletingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListExperienceQueryKey() });
          toast({ title: "Experience deleted" });
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const sortedExperience = [...experience].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground mt-2">
            Manage your work history and professional experience.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-experience">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {sortedExperience.map((exp) => (
          <Card key={exp.id} className="relative group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{exp.role}</CardTitle>
                  <CardDescription className="text-base text-primary font-medium mt-1">
                    {exp.organization}
                  </CardDescription>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleOpenDialog(exp)}
                    data-testid={`button-edit-exp-${exp.id}`}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => {
                      setDeletingId(exp.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    data-testid={`button-delete-exp-${exp.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
                {exp.bullets.split('\n').filter(b => b.trim()).map((bullet, idx) => (
                  <li key={idx}>{bullet.replace(/^[-\*]\s*/, '')}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        {experience.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No experience added yet.</p>
            <Button variant="link" onClick={() => handleOpenDialog()} className="mt-2">
              Add your first role
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role / Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bullets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bullet Points (One per line)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="- Led development of core features&#10;- Improved performance by 40%" 
                        className="min-h-[150px] font-mono text-sm" 
                        {...field} 
                      />
                    </FormControl>
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
                  disabled={createExperience.isPending || updateExperience.isPending}
                >
                  {(createExperience.isPending || updateExperience.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              This will permanently delete this experience entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteExperience.isPending}
            >
              {deleteExperience.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
