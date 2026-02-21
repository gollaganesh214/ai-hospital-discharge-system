import { Router } from "express";
import { prisma } from "../../common/prisma.js";
import { requireAuth, requireRole } from "../../common/auth.js";

export const reportsRouter = Router();

reportsRouter.get("/summary", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const [patients, admissions, discharges, users] = await Promise.all([
    prisma.patient.count(),
    prisma.admission.count(),
    prisma.dischargeSummary.count(),
    prisma.user.count()
  ]);

  res.json({
    patients,
    admissions,
    discharges,
    users,
    generatedAt: new Date().toISOString()
  });
});
