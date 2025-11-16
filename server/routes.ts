import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserConfigurationSchema, insertShiftSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "uber-finanzas-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "El usuario ya existe" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Create default configuration
      await storage.createUserConfiguration({
        userId: user.id,
        hasRent: false,
        weeklyRent: 0,
        monthlyGoal: 800000,
        avgKmPerHour: 25,
        vehicleEfficiency: 12.5,
        fuelPrice: 1350,
      });

      // Set session
      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(400).json({ error: "Error al registrar usuario" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  });

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "No autenticado" });
    }
    next();
  };

  // Configuration Routes
  app.get("/api/configuration", requireAuth, async (req, res) => {
    try {
      const config = await storage.getUserConfiguration(req.session.userId!);
      if (!config) {
        return res.status(404).json({ error: "Configuración no encontrada" });
      }
      res.json(config);
    } catch (error) {
      console.error("Get configuration error:", error);
      res.status(500).json({ error: "Error al obtener configuración" });
    }
  });

  app.put("/api/configuration", requireAuth, async (req, res) => {
    try {
      const configData = insertUserConfigurationSchema.omit({ userId: true }).parse(req.body);
      
      let config = await storage.getUserConfiguration(req.session.userId!);
      
      if (config) {
        config = await storage.updateUserConfiguration(req.session.userId!, configData);
      } else {
        config = await storage.createUserConfiguration({
          userId: req.session.userId!,
          ...configData,
        });
      }

      res.json(config);
    } catch (error) {
      console.error("Update configuration error:", error);
      res.status(400).json({ error: "Error al actualizar configuración" });
    }
  });

  // Shift Routes
  app.get("/api/shifts", requireAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const shifts = await storage.getShiftsByUser(
        req.session.userId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(shifts);
    } catch (error) {
      console.error("Get shifts error:", error);
      res.status(500).json({ error: "Error al obtener turnos" });
    }
  });

  app.post("/api/shifts", requireAuth, async (req, res) => {
    try {
      // Validate and transform data
      const bodyData = {
        ...req.body,
        date: new Date(req.body.date),
        hours: parseFloat(req.body.hours),
        grossEarnings: parseInt(req.body.grossEarnings),
        netEarnings: parseInt(req.body.netEarnings),
        fuelCost: parseInt(req.body.fuelCost),
      };
      
      // Validate with schema
      const shiftData = insertShiftSchema.omit({ userId: true }).parse(bodyData);
      
      const shift = await storage.createShift({
        userId: req.session.userId!,
        ...shiftData,
      });

      res.json(shift);
    } catch (error) {
      console.error("Create shift error:", error);
      res.status(400).json({ error: "Error al crear turno" });
    }
  });

  app.put("/api/shifts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // Verify shift belongs to user
      const existingShift = await storage.getShift(id);
      if (!existingShift || existingShift.userId !== req.session.userId) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }

      // Transform and validate only provided fields
      const updateData: any = {};
      if (req.body.date !== undefined) updateData.date = new Date(req.body.date);
      if (req.body.hours !== undefined) updateData.hours = parseFloat(req.body.hours);
      if (req.body.grossEarnings !== undefined) updateData.grossEarnings = parseInt(req.body.grossEarnings);
      if (req.body.netEarnings !== undefined) updateData.netEarnings = parseInt(req.body.netEarnings);
      if (req.body.fuelCost !== undefined) updateData.fuelCost = parseInt(req.body.fuelCost);

      // Validate with partial schema
      const validatedData = insertShiftSchema.omit({ userId: true }).partial().parse(updateData);

      const shift = await storage.updateShift(id, validatedData);
      res.json(shift);
    } catch (error) {
      console.error("Update shift error:", error);
      res.status(400).json({ error: "Error al actualizar turno" });
    }
  });

  app.delete("/api/shifts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // Verify shift belongs to user
      const existingShift = await storage.getShift(id);
      if (!existingShift || existingShift.userId !== req.session.userId) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }

      await storage.deleteShift(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete shift error:", error);
      res.status(500).json({ error: "Error al eliminar turno" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
