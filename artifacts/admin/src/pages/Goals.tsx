import React, { useState } from "react";
import { useListGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, getListGoalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const goalSchema = z.object({
  content: z.string().min(1, "Goal content is required"),
  sortOrder: z.coerce.number().int().default(0),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export default function Goals() {
  const { data: goals = [], isLoading } = useListGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      content: "",
      sortOrder: 0,
    },
  });

  const handleOpenDialog = (goal?: any) => {
    if (goal) {
      setEditingId(goal.id);
      form.reset({
        content: goal.content,
        sortOrder: goal.sortOrder,
      });
    } else {
      setEditingId(null);
      form.reset({
        content: "",
        sortOrder: goals.length > 0 ? Math.max(...goals.map((g) => g.sortOrder)) + 1 : 0,
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

  const onSubmit = (data: GoalFormValues) => {
    if (editingId) {
      updateGoal.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
            toast({ title: "Goal updated" });
            handleCloseDialog();
          },
        }
      );
    } else {
      createGoal.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
            toast({ title: "Goal created" });
            handleCloseDialog();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteGoal.mutate(
      { id: deletingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
          toast({ title: "Goal deleted" });
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
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const sortedGoals = [...goals].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional goals and objectives.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-goal">
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-3">
        {sortedGoals.map((goal) => (
          <Card key={goal.id} className="group hover-elevate transition-all duration-200">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-base text-foreground leading-relaxed">{goal.content}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleOpenDialog(goal)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                  onClick={() => {
                    setDeletingId(goal.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {goals.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No goals added yet.</p>
            <Button variant="link" onClick={() => handleOpenDialog()} className="mt-2">
              Add your first goal
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Goal" : "Add Goal"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Contribute to 3 major open source projects..." 
                        className="min-h-[100px]"
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
                  disabled={createGoal.isPending || updateGoal.isPending}
                >
                  {(createGoal.isPending || updateGoal.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              This will permanently delete this goal. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteGoal.isPending}
            >
              {deleteGoal.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
