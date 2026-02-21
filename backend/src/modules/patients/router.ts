import { Router } from "express";
import { prisma } from "../../common/prisma.js";
import { createPatientSchema, updatePatientSchema } from "./schema.js";
import { requireAuth, requireRole } from "../../common/auth.js";
import { parsePagination } from "../../common/pagination.js";

export const patientsRouter = Router();

// Public read-only list for browser demos
patientsRouter.get("/", async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const where = q
    ? {
        OR: [
          { mrn: { contains: q, mode: "insensitive" } },
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } }
        ]
      }
    : undefined;
  const [total, patients] = await Promise.all([
    prisma.patient.count({ where }),
    prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      where,
      skip,
      take: limit
    })
  ]);
  res.json({ data: patients, page, limit, total });
});

patientsRouter.post("/", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const parsed = createPatientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const patient = await prisma.patient.create({
    data: {
      ...parsed.data
    }
  });

  res.status(201).json(patient);
});

patientsRouter.patch("/:id", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const patientId = Number(req.params.id);
  if (!Number.isFinite(patientId)) {
    return res.status(400).json({ error: "Invalid patient id" });
  }

  const parsed = updatePatientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const patient = await prisma.patient.update({
    where: { id: patientId },
    data: parsed.data
  });
  res.json(patient);
});

patientsRouter.delete("/:id", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const patientId = Number(req.params.id);
  if (!Number.isFinite(patientId)) {
    return res.status(400).json({ error: "Invalid patient id" });
  }
  await prisma.patient.delete({ where: { id: patientId } });
  res.json({ status: "deleted" });
});
