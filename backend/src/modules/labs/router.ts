import { Router } from "express";
import { prisma } from "../../common/prisma.js";
import { requireAuth, requireRole } from "../../common/auth.js";
import { parsePagination } from "../../common/pagination.js";
import { createLabSchema, updateLabSchema } from "./schema.js";

export const labsRouter = Router();

labsRouter.get("/", requireAuth, requireRole(["ADMIN", "DOCTOR", "NURSE"]), async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const [total, labs] = await Promise.all([
    prisma.labReport.count(),
    prisma.labReport.findMany({
      orderBy: { createdAt: "desc" },
      include: { patient: true },
      skip,
      take: limit
    })
  ]);
  res.json({ data: labs, page, limit, total });
});

labsRouter.post("/", requireAuth, requireRole(["ADMIN", "DOCTOR"]), async (req, res) => {
  const parsed = createLabSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const lab = await prisma.labReport.create({ data: parsed.data });
  res.status(201).json(lab);
});

labsRouter.patch("/:id", requireAuth, requireRole(["ADMIN", "DOCTOR"]), async (req, res) => {
  const labId = Number(req.params.id);
  if (!Number.isFinite(labId)) {
    return res.status(400).json({ error: "Invalid lab id" });
  }
  const parsed = updateLabSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const lab = await prisma.labReport.update({
    where: { id: labId },
    data: parsed.data
  });
  res.json(lab);
});

labsRouter.delete("/:id", requireAuth, requireRole(["ADMIN", "DOCTOR"]), async (req, res) => {
  const labId = Number(req.params.id);
  if (!Number.isFinite(labId)) {
    return res.status(400).json({ error: "Invalid lab id" });
  }
  await prisma.labReport.delete({ where: { id: labId } });
  res.json({ status: "deleted" });
});
