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
import { Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Get in Touch</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                Feel free to reach out for collaborations, mentorship opportunities, or any inquiries. I'm always open to discussing new projects and ideas.
              </p>
            </div>

            <div className="space-y-6">
              <a href="tel:0793672604" className="flex items-center gap-4 text-lg hover:text-primary transition-colors">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                0793672604 (SMS & WhatsApp)
              </a>
              <a href="mailto:hello@example.com" className="flex items-center gap-4 text-lg hover:text-primary transition-colors">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                hello@example.com
              </a>
            </div>

            <div className="pt-8">
              <h3 className="text-xl font-semibold mb-6">Social Profiles</h3>
              <div className="flex gap-4">
                <a href="#" className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors">
                  <SiFacebook className="w-6 h-6" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="#" className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors">
                  <SiInstagram className="w-6 h-6" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="#" className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors">
                  <SiX className="w-6 h-6" />
                  <span className="sr-only">X (Twitter)</span>
                </a>
                <a href="https://wa.me/254793672604" className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary transition-colors">
                  <SiWhatsapp className="w-6 h-6" />
                  <span className="sr-only">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <Button type="submit" className="w-full" data-testid="button-submit-contact">
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
