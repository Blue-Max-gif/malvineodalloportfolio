import { PageTransition } from "@/components/layout/Layout";
import { SiFacebook, SiInstagram, SiX, SiWhatsapp } from "react-icons/si";
import { Phone, Mail } from "lucide-react";
import { useGetContact } from "@workspace/api-client-react";
import { motion } from "framer-motion";

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
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-center gap-5 p-5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur hover:border-primary/40 hover:bg-card/80 transition-colors cursor-pointer group"
    >
      <div className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl text-white text-2xl ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">{value}</p>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const { data: contact } = useGetContact();
  const whatsappNum = contact?.whatsapp?.replace(/\D/g, "") ?? "254793672604";

  const cards: ContactCardProps[] = [
    contact?.phone && {
      href: `tel:${contact.phone}`,
      icon: <Phone className="w-6 h-6" />,
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
      icon: <Mail className="w-6 h-6" />,
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
      <div className="container mx-auto px-4 py-20 max-w-2xl">
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
            Reach out for collaborations, mentorship opportunities, or any inquiries — pick your preferred channel below.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ContactCard {...card} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
