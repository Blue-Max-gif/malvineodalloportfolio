import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { goalsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListGoalsResponse,
  CreateGoalBody,
  UpdateGoalParams,
  UpdateGoalBody,
  UpdateGoalResponse,
  DeleteGoalParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/goals", async (_req: Request, res: Response) => {
  const rows = await db.select().from(goalsTable).orderBy(asc(goalsTable.sortOrder));
  const data = ListGoalsResponse.parse(rows);
  res.json(data);
});

router.post("/goals", async (req: Request, res: Response) => {
  const body = CreateGoalBody.parse(req.body);
  const rows = await db.select().from(goalsTable).orderBy(asc(goalsTable.sortOrder));
  const maxOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sortOrder)) : -1;
  const inserted = await db
    .insert(goalsTable)
    .values({ ...body, sortOrder: maxOrder + 1 })
    .returning();
  res.status(201).json(inserted[0]);
});

router.put("/goals/:id", async (req: Request, res: Response) => {
  const { id } = UpdateGoalParams.parse({ id: Number(req.params.id) });
  const body = UpdateGoalBody.parse(req.body);
  const updated = await db
    .update(goalsTable)
    .set(body)
    .where(eq(goalsTable.id, id))
    .returning();
  if (!updated.length) return void res.status(404).json({ message: "Not found" });
  const data = UpdateGoalResponse.parse(updated[0]);
  res.json(data);
});

router.delete("/goals/:id", async (req: Request, res: Response) => {
  const { id } = DeleteGoalParams.parse({ id: Number(req.params.id) });
  await db.delete(goalsTable).where(eq(goalsTable.id, id));
  res.status(204).send();
});

export default router;
