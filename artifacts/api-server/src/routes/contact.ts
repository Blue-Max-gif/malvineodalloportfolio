import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { contactTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetContactResponse,
  UpdateContactBody,
  UpdateContactResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/contact", async (_req: Request, res: Response) => {
  let rows = await db.select().from(contactTable).limit(1);
  if (rows.length === 0) {
    await db.insert(contactTable).values({
      phone: "+254 700 000000",
      email: "malvineodallo@gmail.com",
      facebook: "https://facebook.com/malvineodallo",
      instagram: "https://instagram.com/malvineodallo",
      twitter: "https://twitter.com/malvineodallo",
      whatsapp: "+254 700 000000",
    });
    rows = await db.select().from(contactTable).limit(1);
  }
  const data = GetContactResponse.parse(rows[0]);
  res.json(data);
});

router.put("/contact", async (req: Request, res: Response) => {
  const body = UpdateContactBody.parse(req.body);
  let rows = await db.select().from(contactTable).limit(1);
  if (rows.length === 0) {
    await db.insert(contactTable).values({});
    rows = await db.select().from(contactTable).limit(1);
  }
  const id = rows[0].id;
  const updated = await db
    .update(contactTable)
    .set(body)
    .where(eq(contactTable.id, id))
    .returning();
  const data = UpdateContactResponse.parse(updated[0]);
  res.json(data);
});

export default router;
