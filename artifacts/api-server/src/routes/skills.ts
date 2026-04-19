import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { skillsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { asc } from "drizzle-orm";
import {
  ListSkillsResponse,
  CreateSkillBody,
  UpdateSkillParams,
  UpdateSkillBody,
  UpdateSkillResponse,
  DeleteSkillParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/skills", async (_req: Request, res: Response) => {
  const rows = await db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder));
  const data = ListSkillsResponse.parse(rows);
  res.json(data);
});

router.post("/skills", async (req: Request, res: Response) => {
  const body = CreateSkillBody.parse(req.body);
  const rows = await db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder));
  const maxOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sortOrder)) : -1;
  const inserted = await db
    .insert(skillsTable)
    .values({ ...body, sortOrder: maxOrder + 1 })
    .returning();
  res.status(201).json(inserted[0]);
});

router.put("/skills/:id", async (req: Request, res: Response) => {
  const { id } = UpdateSkillParams.parse({ id: Number(req.params.id) });
  const body = UpdateSkillBody.parse(req.body);
  const updated = await db
    .update(skillsTable)
    .set(body)
    .where(eq(skillsTable.id, id))
    .returning();
  if (!updated.length) return void res.status(404).json({ message: "Not found" });
  const data = UpdateSkillResponse.parse(updated[0]);
  res.json(data);
});

router.delete("/skills/:id", async (req: Request, res: Response) => {
  const { id } = DeleteSkillParams.parse({ id: Number(req.params.id) });
  await db.delete(skillsTable).where(eq(skillsTable.id, id));
  res.status(204).send();
});

export default router;
