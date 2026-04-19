import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { interestsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListInterestsResponse,
  CreateInterestBody,
  UpdateInterestParams,
  UpdateInterestBody,
  UpdateInterestResponse,
  DeleteInterestParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/interests", async (_req: Request, res: Response) => {
  const rows = await db.select().from(interestsTable).orderBy(asc(interestsTable.sortOrder));
  const data = ListInterestsResponse.parse(rows);
  res.json(data);
});

router.post("/interests", async (req: Request, res: Response) => {
  const body = CreateInterestBody.parse(req.body);
  const rows = await db.select().from(interestsTable).orderBy(asc(interestsTable.sortOrder));
  const maxOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sortOrder)) : -1;
  const inserted = await db
    .insert(interestsTable)
    .values({ ...body, sortOrder: maxOrder + 1 })
    .returning();
  res.status(201).json(inserted[0]);
});

router.put("/interests/:id", async (req: Request, res: Response) => {
  const { id } = UpdateInterestParams.parse({ id: Number(req.params.id) });
  const body = UpdateInterestBody.parse(req.body);
  const updated = await db
    .update(interestsTable)
    .set(body)
    .where(eq(interestsTable.id, id))
    .returning();
  if (!updated.length) return void res.status(404).json({ message: "Not found" });
  const data = UpdateInterestResponse.parse(updated[0]);
  res.json(data);
});

router.delete("/interests/:id", async (req: Request, res: Response) => {
  const { id } = DeleteInterestParams.parse({ id: Number(req.params.id) });
  await db.delete(interestsTable).where(eq(interestsTable.id, id));
  res.status(204).send();
});

export default router;
