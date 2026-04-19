import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  skillsTable,
  experienceTable,
  educationTable,
  interestsTable,
  goalsTable,
  profileTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import { GetDashboardStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req: Request, res: Response) => {
  const [skills, experience, education, interests, goals, profile] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(skillsTable),
      db.select({ count: sql<number>`count(*)` }).from(experienceTable),
      db.select({ count: sql<number>`count(*)` }).from(educationTable),
      db.select({ count: sql<number>`count(*)` }).from(interestsTable),
      db.select({ count: sql<number>`count(*)` }).from(goalsTable),
      db.select().from(profileTable).limit(1),
    ]);

  const prof = profile[0];
  const data = GetDashboardStatsResponse.parse({
    skillsCount: Number(skills[0].count),
    experienceCount: Number(experience[0].count),
    educationCount: Number(education[0].count),
    interestsCount: Number(interests[0].count),
    goalsCount: Number(goals[0].count),
    hasProfilePhoto: !!(prof?.profilePhotoPath),
    hasCv: !!(prof?.cvPath),
  });
  res.json(data);
});

export default router;
