import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

async function getAdminKey(): Promise<string> {
  const rows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "admin_key"));
  return rows[0]?.value ?? "12345678";
}

router.post("/admin/verify", async (req: Request, res: Response) => {
  const { key } = req.body as { key?: string };
  if (!key) return void res.status(400).json({ valid: false, message: "Key required" });
  const adminKey = await getAdminKey();
  res.json({ valid: key === adminKey });
});

router.put("/admin/key", async (req: Request, res: Response) => {
  const { currentKey, newKey } = req.body as { currentKey?: string; newKey?: string };
  if (!currentKey || !newKey) return void res.status(400).json({ message: "currentKey and newKey required" });
  if (newKey.length < 6) return void res.status(400).json({ message: "New key must be at least 6 characters" });
  const adminKey = await getAdminKey();
  if (currentKey !== adminKey) return void res.status(401).json({ message: "Current key is incorrect" });
  await db
    .insert(siteSettingsTable)
    .values({ key: "admin_key", value: newKey })
    .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: newKey } });
  res.json({ success: true });
});

export default router;
