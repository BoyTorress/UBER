import { 
  type User, 
  type InsertUser,
  type UserConfiguration,
  type InsertUserConfiguration,
  type Shift,
  type InsertShift,
  users,
  userConfigurations,
  shifts,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Configuration methods
  getUserConfiguration(userId: string): Promise<UserConfiguration | undefined>;
  createUserConfiguration(config: InsertUserConfiguration): Promise<UserConfiguration>;
  updateUserConfiguration(userId: string, config: Partial<InsertUserConfiguration>): Promise<UserConfiguration | undefined>;

  // Shift methods
  getShift(id: string): Promise<Shift | undefined>;
  getShiftsByUser(userId: string, startDate?: Date, endDate?: Date): Promise<Shift[]>;
  createShift(shift: InsertShift): Promise<Shift>;
  updateShift(id: string, shift: Partial<InsertShift>): Promise<Shift | undefined>;
  deleteShift(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private configurations: Map<string, UserConfiguration>;
  private shifts: Map<string, Shift>;

  constructor() {
    this.users = new Map();
    this.configurations = new Map();
    this.shifts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserConfiguration(userId: string): Promise<UserConfiguration | undefined> {
    return Array.from(this.configurations.values()).find(
      (config) => config.userId === userId,
    );
  }

  async createUserConfiguration(config: InsertUserConfiguration): Promise<UserConfiguration> {
    const id = randomUUID();
    const configuration: UserConfiguration = {
      hasRent: config.hasRent ?? false,
      weeklyRent: config.weeklyRent ?? 0,
      ...config,
      id,
      updatedAt: new Date(),
    };
    this.configurations.set(id, configuration);
    return configuration;
  }

  async updateUserConfiguration(userId: string, configData: Partial<InsertUserConfiguration>): Promise<UserConfiguration | undefined> {
    const existing = await this.getUserConfiguration(userId);
    if (!existing) return undefined;
    
    const updated: UserConfiguration = {
      ...existing,
      ...configData,
      updatedAt: new Date(),
    };
    this.configurations.set(existing.id, updated);
    return updated;
  }

  async getShift(id: string): Promise<Shift | undefined> {
    return this.shifts.get(id);
  }

  async getShiftsByUser(userId: string, startDate?: Date, endDate?: Date): Promise<Shift[]> {
    let userShifts = Array.from(this.shifts.values()).filter(
      (shift) => shift.userId === userId,
    );

    if (startDate) {
      userShifts = userShifts.filter(shift => shift.date >= startDate);
    }
    if (endDate) {
      userShifts = userShifts.filter(shift => shift.date <= endDate);
    }

    return userShifts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createShift(insertShift: InsertShift): Promise<Shift> {
    const id = randomUUID();
    const shift: Shift = {
      ...insertShift,
      id,
      createdAt: new Date(),
    };
    this.shifts.set(id, shift);
    return shift;
  }

  async updateShift(id: string, shiftData: Partial<InsertShift>): Promise<Shift | undefined> {
    const existing = this.shifts.get(id);
    if (!existing) return undefined;

    const updated: Shift = {
      ...existing,
      ...shiftData,
    };
    this.shifts.set(id, updated);
    return updated;
  }

  async deleteShift(id: string): Promise<boolean> {
    return this.shifts.delete(id);
  }
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const newUser = {
      ...insertUser,
      id,
      createdAt: now,
    };
    await db.insert(users).values(newUser);
    return newUser;
  }

  async getUserConfiguration(userId: string): Promise<UserConfiguration | undefined> {
    const result = await db.select().from(userConfigurations).where(eq(userConfigurations.userId, userId)).limit(1);
    return result[0];
  }

  async createUserConfiguration(config: InsertUserConfiguration): Promise<UserConfiguration> {
    const id = randomUUID();
    const now = new Date();
    const newConfig = {
      ...config,
      id,
      hasRent: config.hasRent ?? false,
      weeklyRent: config.weeklyRent ?? 0,
      updatedAt: now,
    };
    await db.insert(userConfigurations).values(newConfig);
    return newConfig;
  }

  async updateUserConfiguration(userId: string, configData: Partial<InsertUserConfiguration>): Promise<UserConfiguration | undefined> {
    const now = new Date();
    await db
      .update(userConfigurations)
      .set({ ...configData, updatedAt: now })
      .where(eq(userConfigurations.userId, userId));
    
    return this.getUserConfiguration(userId);
  }

  async getShift(id: string): Promise<Shift | undefined> {
    const result = await db.select().from(shifts).where(eq(shifts.id, id)).limit(1);
    return result[0];
  }

  async getShiftsByUser(userId: string, startDate?: Date, endDate?: Date): Promise<Shift[]> {
    let query = db.select().from(shifts).where(eq(shifts.userId, userId));

    if (startDate && endDate) {
      query = db.select().from(shifts).where(
        and(
          eq(shifts.userId, userId),
          gte(shifts.date, startDate),
          lte(shifts.date, endDate)
        )
      );
    } else if (startDate) {
      query = db.select().from(shifts).where(
        and(
          eq(shifts.userId, userId),
          gte(shifts.date, startDate)
        )
      );
    } else if (endDate) {
      query = db.select().from(shifts).where(
        and(
          eq(shifts.userId, userId),
          lte(shifts.date, endDate)
        )
      );
    }

    const result = await query.orderBy(desc(shifts.date));
    return result;
  }

  async createShift(insertShift: InsertShift): Promise<Shift> {
    const id = randomUUID();
    const now = new Date();
    const newShift = {
      ...insertShift,
      id,
      createdAt: now,
    };
    await db.insert(shifts).values(newShift);
    return newShift;
  }

  async updateShift(id: string, shiftData: Partial<InsertShift>): Promise<Shift | undefined> {
    await db
      .update(shifts)
      .set(shiftData)
      .where(eq(shifts.id, id));
    
    return this.getShift(id);
  }

  async deleteShift(id: string): Promise<boolean> {
    await db.delete(shifts).where(eq(shifts.id, id));
    return true;
  }
}

// Use database storage instead of in-memory
export const storage = new DbStorage();
