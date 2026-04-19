import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { educationTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListEducationResponse,
  CreateEducationBody,
  UpdateEducationParams,
  UpdateEducationBody,
  UpdateEducationResponse,
  DeleteEducationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/education", async (_req: Request, res: Response) => {
  const rows = await db.select().from(educationTable).orderBy(asc(educationTable.sortOrder));
  const data = ListEducationResponse.parse(rows);
  res.json(data);
});

router.post("/education", async (req: Request, res: Response) => {
  const body = CreateEducationBody.parse(req.body);
  const rows = await db.select().from(educationTable).orderBy(asc(educationTable.sortOrder));
  const maxOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sortOrder)) : -1;
  const inserted = await db
    .insert(educationTable)
    .values({ ...body, sortOrder: maxOrder + 1 })
    .returning();
  res.status(201).json(inserted[0]);
});

router.put("/education/:id", async (req: Request, res: Response) => {
  const { id } = UpdateEducationParams.parse({ id: Number(req.params.id) });
  const body = UpdateEducationBody.parse(req.body);
  const updated = await db
    .update(educationTable)
    .set(body)
    .where(eq(educationTable.id, id))
    .returning();
  if (!updated.length) return void res.status(404).json({ message: "Not found" });
  const data = UpdateEducationResponse.parse(updated[0]);
  res.json(data);
});

router.delete("/education/:id", async (req: Request, res: Response) => {
  const { id } = DeleteEducationParams.parse({ id: Number(req.params.id) });
  await db.delete(educationTable).where(eq(educationTable.id, id));
  res.status(204).send();
});

export default router;
