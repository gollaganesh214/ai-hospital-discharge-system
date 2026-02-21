import { Router } from "express";
import { prisma } from "../../common/prisma.js";
import { requireAuth, requireRole } from "../../common/auth.js";
import { updateRoleSchema } from "./schema.js";

export const usersRouter = Router();

usersRouter.get("/", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true }
  });
  res.json(users);
});

usersRouter.patch("/:id/role", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const parsed = updateRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const userId = Number(req.params.id);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data.role }
  });
  res.json(user);
});
