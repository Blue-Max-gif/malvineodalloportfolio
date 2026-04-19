import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Mail, MailOpen, Inbox, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: number;
  createdAt: string;
}

async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/contact/messages");
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

async function markAsRead(id: number): Promise<void> {
  await fetch(`/api/contact/messages/${id}/read`, { method: "PUT" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Messages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: fetchMessages,
  });

  const [expanded, setExpanded] = useState<number | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleExpand = async (msg: Message) => {
    if (expanded === msg.id) {
      setExpanded(null);
      return;
    }
    setExpanded(msg.id);
    if (!msg.isRead) {
      await markAsRead(msg.id);
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    }
  };

  const clearReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/contact/messages/read", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ cleared: number }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      setClearDialogOpen(false);
      toast({
        title: "Messages cleared",
        description: `${data.cleared} read message${data.cleared !== 1 ? "s" : ""} removed.`,
      });
    },
    onError: () => toast({ title: "Error", description: "Could not clear messages.", variant: "destructive" }),
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const readCount = messages.filter((m) => m.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Messages from your portfolio contact form
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="default" className="text-sm px-3 py-1">
              {unreadCount} unread
            </Badge>
          )}
          {readCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setClearDialogOpen(true)}
              disabled={clearReadMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear Read ({readCount})
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <Inbox className="w-12 h-12 text-muted-foreground opacity-40" />
            <p className="text-lg font-medium text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">Messages sent through your portfolio contact form will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`cursor-pointer transition-all border ${!msg.isRead ? "border-primary/40 bg-primary/5" : "border-border"}`}
              onClick={() => handleExpand(msg)}
              data-testid={`message-item-${msg.id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 shrink-0 ${!msg.isRead ? "text-primary" : "text-muted-foreground"}`}>
                      {msg.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold ${!msg.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                          {msg.name}
                        </span>
                        {!msg.isRead && (
                          <Badge variant="default" className="text-xs px-1.5 py-0">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.email}</p>
                      {expanded !== msg.id && (
                        <p className="text-sm text-foreground/70 mt-1 truncate">{msg.message}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 pt-0.5">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                {expanded === msg.id && (
                  <div className="mt-4 ml-8 border-t pt-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</p>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your message via portfolio`}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-4 h-4" />
                        Reply to {msg.email}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear read messages?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {readCount} read message{readCount !== 1 ? "s" : ""}. Unread messages will not be affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clearReadMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear {readCount} message{readCount !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
