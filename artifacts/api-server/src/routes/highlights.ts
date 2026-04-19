import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { highlightItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/highlights", async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(highlightItemsTable)
    .orderBy(asc(highlightItemsTable.category), asc(highlightItemsTable.sortOrder));
  res.json(rows);
});

router.post("/highlights", async (req: Request, res: Response) => {
  const { category, content, sortOrder } = req.body as {
    category?: string;
    content?: string;
    sortOrder?: number;
  };
  if (!category || !content) {
    return void res.status(400).json({ message: "category and content are required" });
  }
  const inserted = await db
    .insert(highlightItemsTable)
    .values({ category: String(category), content: String(content), sortOrder: sortOrder ?? 0 })
    .returning();
  res.status(201).json(inserted[0]);
});

router.put("/highlights/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { category, content, sortOrder } = req.body as {
    category?: string;
    content?: string;
    sortOrder?: number;
  };
  const updated = await db
    .update(highlightItemsTable)
    .set({
      ...(category !== undefined && { category: String(category) }),
      ...(content !== undefined && { content: String(content) }),
      ...(sortOrder !== undefined && { sortOrder }),
    })
    .where(eq(highlightItemsTable.id, id))
    .returning();
  if (!updated.length) return void res.status(404).json({ message: "Not found" });
  res.json(updated[0]);
});

router.delete("/highlights/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await db
    .delete(highlightItemsTable)
    .where(eq(highlightItemsTable.id, id))
    .returning();
  if (!deleted.length) return void res.status(404).json({ message: "Not found" });
  res.json({ success: true });
});

export default router;
