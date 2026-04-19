import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SiFacebook, SiInstagram, SiX, SiWhatsapp } from "react-icons/si";
import { Phone, Mail, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetContact } from "@workspace/api-client-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { data: contact } = useGetContact();
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactForm) {
    setIsSending(true);
    try {
      const res = await fetch("/api/contact/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      form.reset();
      toast({
        title: "Message sent!",
        description: "Malvine will get back to you soon.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or reach out directly.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }

  const whatsappNum = contact?.whatsapp?.replace(/\D/g, "") ?? "254793672604";

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Get in Touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                Feel free to reach out for collaborations, mentorship opportunities, or any inquiries. I'm always open to discussing new projects and ideas.
              </p>
            </div>

            <div className="space-y-6">
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-4 text-lg hover:text-primary transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-4 text-lg hover:text-primary transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  {contact.email}
                </a>
              )}
            </div>

            <div className="pt-8">
              <h3 className="text-xl font-semibold mb-6">Social Profiles</h3>
              <div className="flex gap-4">
                {contact?.facebook && (
                  <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors"
                    title="Message on Facebook">
                    <SiFacebook className="w-6 h-6" />
                    <span className="sr-only">Facebook</span>
                  </a>
                )}
                {contact?.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors"
                    title="Message on Instagram">
                    <SiInstagram className="w-6 h-6" />
                    <span className="sr-only">Instagram</span>
                  </a>
                )}
                {contact?.twitter && (
                  <a href={contact.twitter} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors"
                    title="Message on X">
                    <SiX className="w-6 h-6" />
                    <span className="sr-only">X (Twitter)</span>
                  </a>
                )}
                {contact?.whatsapp && (
                  <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors"
                    title="Chat on WhatsApp">
                    <SiWhatsapp className="w-6 h-6" />
                    <span className="sr-only">WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <h3 className="text-xl font-semibold">Message sent!</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. Malvine will get back to you soon.</p>
                  <Button variant="outline" onClick={() => setSent(false)} className="mt-4">
                    Send another message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" type="email" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How can we work together?"
                              className="min-h-[150px] bg-background/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSending} data-testid="button-submit-contact">
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : "Send Message"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
