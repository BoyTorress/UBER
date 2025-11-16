import { sql } from "drizzle-orm";
import { pgTable, text, varchar, doublePrecision, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userConfigurations = pgTable("user_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  hasRent: boolean("has_rent").default(false).notNull(),
  weeklyRent: integer("weekly_rent").default(0),
  monthlyGoal: integer("monthly_goal").notNull(),
  avgKmPerHour: doublePrecision("avg_km_per_hour").notNull(),
  vehicleEfficiency: doublePrecision("vehicle_efficiency").notNull(),
  fuelPrice: integer("fuel_price").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserConfigurationSchema = createInsertSchema(userConfigurations).omit({
  id: true,
  updatedAt: true,
});

export type InsertUserConfiguration = z.infer<typeof insertUserConfigurationSchema>;
export type UserConfiguration = typeof userConfigurations.$inferSelect;

export const shifts = pgTable("shifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  hours: doublePrecision("hours").notNull(),
  grossEarnings: integer("gross_earnings").notNull(),
  netEarnings: integer("net_earnings").notNull(),
  fuelCost: integer("fuel_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
  createdAt: true,
});

export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Shift = typeof shifts.$inferSelect;
