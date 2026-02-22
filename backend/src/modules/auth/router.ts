import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../common/prisma.js";
import { signToken, requireAuth } from "../../common/auth.js";
import {
  registerSchema,
  loginSchema,
  forgotSchema
} from "./schema.js";

export const authRouter = Router();

authRouter.get("/register", (_req, res) => {
  res.status(405).json({ error: "Use POST /api/auth/register" });
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role ?? "NURSE"
    }
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.status(201).json({ token, user });
});

authRouter.get("/login", (_req, res) => {
  res.status(405).json({ error: "Use POST /api/auth/login" });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user });
});

authRouter.post("/forgot", async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  res.json({ status: "ok", message: "Reset link sent (demo)" });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, role: true, createdAt: true }
  });
  res.json(user);
});
