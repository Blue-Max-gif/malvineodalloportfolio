import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  aboutText: text("about_text").notNull(),
  profilePhotoPath: text("profile_photo_path"),
  cvPath: text("cv_path"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertSkillSchema = createInsertSchema(skillsTable).omit({
  id: true,
});
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skillsTable.$inferSelect;

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  bullets: text("bullets").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertExperienceSchema = createInsertSchema(experienceTable).omit({
  id: true,
});
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceTable.$inferSelect;

export const educationTable = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  year: text("year").notNull(),
  grade: text("grade"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertEducationSchema = createInsertSchema(educationTable).omit({
  id: true,
});
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof educationTable.$inferSelect;

export const interestsTable = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertInterestSchema = createInsertSchema(interestsTable).omit({
  id: true,
});
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Interest = typeof interestsTable.$inferSelect;

export const goalsTable = pgTable("goals", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertGoalSchema = createInsertSchema(goalsTable).omit({
  id: true,
});
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goalsTable.$inferSelect;

export const contactTable = pgTable("contact", {
  id: serial("id").primaryKey(),
  phone: text("phone"),
  email: text("email"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  whatsapp: text("whatsapp"),
});

export const insertContactSchema = createInsertSchema(contactTable).omit({
  id: true,
});
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactTable.$inferSelect;
