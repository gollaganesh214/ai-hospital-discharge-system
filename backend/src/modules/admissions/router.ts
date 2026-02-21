import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../common/prisma.js";
import { requireAuth, requireRole } from "../../common/auth.js";
import { parsePagination } from "../../common/pagination.js";
import { createAdmissionSchema, updateAdmissionSchema } from "./schema.js";

export const admissionsRouter = Router();

admissionsRouter.get("/", requireAuth, requireRole(["ADMIN", "DOCTOR", "NURSE"]), async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const where = q
    ? {
        OR: [
          { diagnosis: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { attendingPhysician: { contains: q, mode: Prisma.QueryMode.insensitive } },
          {
            patient: {
              OR: [
                { mrn: { contains: q, mode: Prisma.QueryMode.insensitive } },
                { firstName: { contains: q, mode: Prisma.QueryMode.insensitive } },
                { lastName: { contains: q, mode: Prisma.QueryMode.insensitive } }
              ]
            }
          }
        ]
      }
    : undefined;
  const [total, admissions] = await Promise.all([
    prisma.admission.count({ where }),
    prisma.admission.findMany({
      orderBy: { admittedAt: "desc" },
      include: { patient: true, dischargeSummary: true },
      where,
      skip,
      take: limit
    })
  ]);
  res.json({ data: admissions, page, limit, total });
});

admissionsRouter.post("/", requireAuth, requireRole(["ADMIN", "DOCTOR"]), async (req, res) => {
  const parsed = createAdmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const admission = await prisma.admission.create({
    data: parsed.data
  });
  res.status(201).json(admission);
});

admissionsRouter.patch("/:id", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const admissionId = Number(req.params.id);
  if (!Number.isFinite(admissionId)) {
    return res.status(400).json({ error: "Invalid admission id" });
  }
  const parsed = updateAdmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const admission = await prisma.admission.update({
    where: { id: admissionId },
    data: parsed.data
  });
  res.json(admission);
});

admissionsRouter.delete("/:id", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const admissionId = Number(req.params.id);
  if (!Number.isFinite(admissionId)) {
    return res.status(400).json({ error: "Invalid admission id" });
  }
  await prisma.admission.delete({ where: { id: admissionId } });
  res.json({ status: "deleted" });
});
