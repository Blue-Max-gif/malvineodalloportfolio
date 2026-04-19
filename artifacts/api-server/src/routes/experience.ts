import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { experienceTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListExperienceResponse,
  CreateExperienceBody,
  UpdateExperienceParams,
  UpdateExperienceBody,
  UpdateExperienceResponse,
  DeleteExperienceParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/experience", async (_req: Request, res: Response) => {
  const rows = await db.select().from(experienceTable).orderBy(asc(experienceTable.sortOrder));
  const data = ListExperienceResponse.parse(rows);
  res.json(data);
});

router.post("/experience", async (req: Request, res: Response) => {
  const body = CreateExperienceBody.parse(req.body);
  const rows = await db.select().from(experienceTable).orderBy(asc(experienceTable.sortOrder));
  const maxOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sortOrder)) : -1;
  const inserted = await db
    .insert(experienceTable)
    .values({ ...body, sortOrder: maxOrder + 1 })
    .returning();
  res.status(201).json(inserted[0]);
});

router.put("/experience/:id", async (req: Request, res: Response) => {
  const { id } = UpdateExperienceParams.parse({ id: Number(req.params.id) });
  const body = UpdateExperienceBody.parse(req.body);
  const updated = await db
    .update(experienceTable)
    .set(body)
    .where(eq(experienceTable.id, id))
    .returning();
  if (!updated.length) return void res.status(404).json({ message: "Not found" });
  const data = UpdateExperienceResponse.parse(updated[0]);
  res.json(data);
});

router.delete("/experience/:id", async (req: Request, res: Response) => {
  const { id } = DeleteExperienceParams.parse({ id: Number(req.params.id) });
  await db.delete(experienceTable).where(eq(experienceTable.id, id));
  res.status(204).send();
});

export default router;
