import { sql } from "drizzle-orm";
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userConfigurations = sqliteTable("user_configurations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  hasRent: integer("has_rent", { mode: "boolean" }).default(false).notNull(),
  weeklyRent: integer("weekly_rent").default(0),
  monthlyGoal: integer("monthly_goal").notNull(),
  avgKmPerHour: real("avg_km_per_hour").notNull(),
  vehicleEfficiency: real("vehicle_efficiency").notNull(),
  fuelPrice: integer("fuel_price").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserConfigurationSchema = createInsertSchema(userConfigurations).omit({
  id: true,
  updatedAt: true,
});

export type InsertUserConfiguration = z.infer<typeof insertUserConfigurationSchema>;
export type UserConfiguration = typeof userConfigurations.$inferSelect;

export const shifts = sqliteTable("shifts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  hours: real("hours").notNull(),
  grossEarnings: integer("gross_earnings").notNull(),
  netEarnings: integer("net_earnings").notNull(),
  fuelCost: integer("fuel_cost").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
  createdAt: true,
});

export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Shift = typeof shifts.$inferSelect;
