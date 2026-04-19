import React, { useState } from "react";
import { useListInterests, useCreateInterest, useUpdateInterest, useDeleteInterest, getListInterestsQueryKey } from "@workspace/api-client-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const interestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon name is required"),
  sortOrder: z.coerce.number().int().default(0),
});

type InterestFormValues = z.infer<typeof interestSchema>;

export default function Interests() {
  const { data: interests = [], isLoading } = useListInterests();
  const createInterest = useCreateInterest();
  const updateInterest = useUpdateInterest();
  const deleteInterest = useDeleteInterest();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      name: "",
      icon: "",
      sortOrder: 0,
    },
  });

  const handleOpenDialog = (interest?: any) => {
    if (interest) {
      setEditingId(interest.id);
      form.reset({
        name: interest.name,
        icon: interest.icon,
        sortOrder: interest.sortOrder,
      });
    } else {
      setEditingId(null);
      form.reset({
        name: "",
        icon: "",
        sortOrder: interests.length > 0 ? Math.max(...interests.map((i) => i.sortOrder)) + 1 : 0,
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

  const onSubmit = (data: InterestFormValues) => {
    if (editingId) {
      updateInterest.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListInterestsQueryKey() });
            toast({ title: "Interest updated" });
            handleCloseDialog();
          },
        }
      );
    } else {
      createInterest.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListInterestsQueryKey() });
            toast({ title: "Interest created" });
            handleCloseDialog();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteInterest.mutate(
      { id: deletingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListInterestsQueryKey() });
          toast({ title: "Interest deleted" });
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const sortedInterests = [...interests].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interests</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal interests and hobbies.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-interest">
          <Plus className="mr-2 h-4 w-4" />
          Add Interest
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedInterests.map((interest) => (
          <Card key={interest.id} className="group relative">
            <CardContent className="p-4 flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono text-primary font-bold">#</span>
                <span className="font-medium">{interest.name}</span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => handleOpenDialog(interest)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" 
                  onClick={() => {
                    setDeletingId(interest.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {interests.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No interests added yet.</p>
            <Button variant="link" onClick={() => handleOpenDialog()} className="mt-2">
              Add your first interest
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Interest" : "Add Interest"}</DialogTitle>
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
                      <Input placeholder="Photography, Open Source..." {...field} />
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
                      <Input placeholder="Camera..." {...field} />
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
                  disabled={createInterest.isPending || updateInterest.isPending}
                >
                  {(createInterest.isPending || updateInterest.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              This will permanently delete this interest. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteInterest.isPending}
            >
              {deleteInterest.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
