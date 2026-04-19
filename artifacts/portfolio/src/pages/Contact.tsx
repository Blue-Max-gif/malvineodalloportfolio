import { PageTransition } from "@/components/layout/Layout";
import { SiFacebook, SiInstagram, SiX, SiWhatsapp } from "react-icons/si";
import { Phone, Mail, Loader2, CheckCircle } from "lucide-react";
import { useGetContact } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

interface ContactCardProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  external?: boolean;
  color: string;
}

function ContactCard({ href, icon, label, value, external, color }: ContactCardProps) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur hover:border-primary/40 hover:bg-card/80 transition-colors cursor-pointer group"
    >
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg text-white text-xl ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{value}</p>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const { data: contact } = useGetContact();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const whatsappNum = contact?.whatsapp?.replace(/\D/g, "") ?? "254793672604";

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
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      form.reset();
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

  const cards: ContactCardProps[] = [
    contact?.phone && {
      href: `tel:${contact.phone}`,
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: contact.phone,
      external: false,
      color: "bg-emerald-500",
    },
    contact?.whatsapp && {
      href: `https://wa.me/${whatsappNum}`,
      icon: <SiWhatsapp />,
      label: "WhatsApp",
      value: contact.whatsapp,
      external: true,
      color: "bg-[#25D366]",
    },
    contact?.email && {
      href: `mailto:${contact.email}`,
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: contact.email,
      external: false,
      color: "bg-blue-500",
    },
    contact?.facebook && {
      href: contact.facebook,
      icon: <SiFacebook />,
      label: "Facebook",
      value: "Message on Facebook",
      external: true,
      color: "bg-[#1877F2]",
    },
    contact?.instagram && {
      href: contact.instagram,
      icon: <SiInstagram />,
      label: "Instagram",
      value: "DM on Instagram",
      external: true,
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
    },
    contact?.twitter && {
      href: contact.twitter,
      icon: <SiX />,
      label: "X (Twitter)",
      value: "@odallo_jnr",
      external: true,
      color: "bg-black",
    },
  ].filter(Boolean) as ContactCardProps[];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg">
            Reach out for collaborations, mentorship opportunities, or any inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            className="flex flex-col gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.label}
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
              >
                <ContactCard {...card} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {sent ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <h3 className="text-xl font-semibold">Message sent!</h3>
                    <p className="text-muted-foreground">Thanks for reaching out. Malvine will get back to you.</p>
                    <Button variant="outline" onClick={() => setSent(false)} className="mt-2">
                      Send another
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                              <Input placeholder="your@email.com" type="email" {...field} className="bg-background/50" />
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
                                className="min-h-[130px] bg-background/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSending}>
                        {isSending ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                        ) : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
