import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetContact, useUpdateContact, getGetContactQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const contactSchema = z.object({
  phone: z.string().nullable().optional(),
  email: z.string().email("Must be a valid email").or(z.literal("")).nullable().optional(),
  facebook: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  instagram: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  twitter: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  whatsapp: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { data: contact, isLoading } = useGetContact();
  const updateContact = useUpdateContact();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: "",
      email: "",
      facebook: "",
      instagram: "",
      twitter: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        phone: contact.phone || "",
        email: contact.email || "",
        facebook: contact.facebook || "",
        instagram: contact.instagram || "",
        twitter: contact.twitter || "",
        whatsapp: contact.whatsapp || "",
      });
    }
  }, [contact, form]);

  const onSubmit = (data: ContactFormValues) => {
    // Clean up empty strings to nulls
    const cleanedData = {
      phone: data.phone || null,
      email: data.email || null,
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      twitter: data.twitter || null,
      whatsapp: data.whatsapp || null,
    };

    updateContact.mutate(
      { data: cleanedData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetContactQueryKey() });
          toast({
            title: "Contact updated",
            description: "Your contact information has been saved.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update contact info.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Information</h1>
        <p className="text-muted-foreground mt-2">
          Manage how visitors can reach you and your social media links.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Direct Contact</CardTitle>
              <CardDescription>
                Your primary methods of communication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="hello@example.com" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media & Links</CardTitle>
              <CardDescription>
                Full URLs to your social profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter / X</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/username" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/username" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/username" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://wa.me/1234567890" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button 
                type="submit" 
                disabled={updateContact.isPending}
                data-testid="button-save-contact"
              >
                {updateContact.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Contact Info
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
