import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { profileTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetProfileResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/profile", async (_req: Request, res: Response) => {
  let rows = await db.select().from(profileTable).limit(1);
  if (rows.length === 0) {
    await db.insert(profileTable).values({
      name: "Ochieng Malvine Odallo",
      title: "Student Leader & CEO",
      tagline: "Forensic Science student, community leader, social entrepreneur.",
      aboutText: "BSc Forensic Science student at Kirinyaga University. CEO of Uplift Society and Organizing Secretary of NUSA.",
    });
    rows = await db.select().from(profileTable).limit(1);
  }
  const data = GetProfileResponse.parse({ ...rows[0], updatedAt: rows[0].updatedAt.toISOString() });
  res.json(data);
});

const serializeProfile = (row: typeof profileTable.$inferSelect) => ({
  ...row,
  updatedAt: row.updatedAt.toISOString(),
});

router.put("/profile", async (req: Request, res: Response) => {
  const body = UpdateProfileBody.parse(req.body);
  let rows = await db.select().from(profileTable).limit(1);
  if (rows.length === 0) {
    await db.insert(profileTable).values({
      name: "Ochieng Malvine Odallo",
      title: "Student Leader & CEO",
      tagline: "Forensic Science student, community leader, social entrepreneur.",
      aboutText: "BSc Forensic Science student at Kirinyaga University.",
    });
    rows = await db.select().from(profileTable).limit(1);
  }
  const id = rows[0].id;
  const updated = await db
    .update(profileTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(profileTable.id, id))
    .returning();
  const data = UpdateProfileResponse.parse(serializeProfile(updated[0]));
  res.json(data);
});

export default router;
