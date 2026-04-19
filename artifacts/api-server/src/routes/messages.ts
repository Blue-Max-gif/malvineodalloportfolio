import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { Resend } from "resend";

const router: IRouter = Router();

router.post("/contact/message", async (req: Request, res: Response) => {
  const { name, email, message } = req.body as { name?: string; email?: string; message?: string };
  if (!name || !email || !message) {
    return void res.status(400).json({ message: "name, email, and message are required" });
  }
  const body = { name: String(name).trim(), email: String(email).trim(), message: String(message).trim() };

  const inserted = await db
    .insert(contactMessagesTable)
    .values(body)
    .returning();

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["odallojnr98@gmail.com"],
        subject: `New message from ${body.name} via your portfolio`,
        html: `
          <h2>New Contact Form Message</h2>
          <p><strong>From:</strong> ${body.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 3px solid #3b82f6; padding-left: 12px; color: #555;">
            ${body.message.replace(/\n/g, "<br>")}
          </blockquote>
          <hr>
          <p style="color: #888; font-size: 12px;">Sent via your portfolio contact form.</p>
        `,
      });
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  }

  res.status(201).json({
    ...inserted[0],
    createdAt: inserted[0].createdAt.toISOString(),
  });
});

router.get("/contact/messages", async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.createdAt));
  res.json(
    rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
  );
});

router.get("/contact/messages/unread-count", async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(contactMessagesTable);
  const unread = rows.filter((r) => r.isRead === 0).length;
  res.json({ unreadCount: unread, totalCount: rows.length });
});

router.delete("/contact/messages/read", async (_req: Request, res: Response) => {
  const deleted = await db
    .delete(contactMessagesTable)
    .where(eq(contactMessagesTable.isRead, 1))
    .returning();
  res.json({ cleared: deleted.length });
});

router.put("/contact/messages/:id/read", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await db
    .update(contactMessagesTable)
    .set({ isRead: 1 })
    .where(eq(contactMessagesTable.id, id))
    .returning();
  if (!updated.length) return void res.status(404).json({ message: "Not found" });
  res.json({ ...updated[0], createdAt: updated[0].createdAt.toISOString() });
});

export default router;
