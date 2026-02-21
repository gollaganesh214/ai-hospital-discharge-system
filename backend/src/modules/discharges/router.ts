import { Router } from "express";
import { prisma } from "../../common/prisma.js";
import { createDischargeSchema, updateDischargeSchema } from "./schema.js";
import { requireAuth, requireRole } from "../../common/auth.js";
import { generateDischargeSummary } from "../../common/openai.js";
import { parsePagination } from "../../common/pagination.js";

export const dischargesRouter = Router();

dischargesRouter.get("/", requireAuth, requireRole(["ADMIN", "DOCTOR"]), async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const [total, discharges] = await Promise.all([
    prisma.dischargeSummary.count(),
    prisma.dischargeSummary.findMany({
      orderBy: { createdAt: "desc" },
      include: { admission: { include: { patient: true } } },
      skip,
      take: limit
    })
  ]);
  res.json({ data: discharges, page, limit, total });
});

dischargesRouter.post("/", requireAuth, requireRole(["ADMIN", "DOCTOR"]), async (req, res) => {
  const parsed = createDischargeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const admission = await prisma.admission.findUnique({
    where: { id: parsed.data.admissionId },
    include: { patient: true }
  });
  if (!admission) {
    return res.status(404).json({ error: "Admission not found" });
  }

  const summaryText = await generateDischargeSummary({
    patientName: `${admission.patient.firstName} ${admission.patient.lastName}`,
    mrn: admission.patient.mrn,
    diagnosis: parsed.data.finalDiagnosis,
    keyFindings: parsed.data.keyFindings,
    medications: parsed.data.medications,
    followUp: parsed.data.followUp,
    attendingPhysician: admission.attendingPhysician
  });

  const discharge = await prisma.dischargeSummary.create({
    data: {
      admissionId: parsed.data.admissionId,
      summaryText,
      medications: parsed.data.medications,
      followUp: parsed.data.followUp,
      aiSuggested: Boolean(process.env.OPENAI_API_KEY)
    }
  });

  res.status(201).json(discharge);
});

dischargesRouter.patch("/:id", requireAuth, requireRole(["ADMIN", "DOCTOR"]), async (req, res) => {
  const dischargeId = Number(req.params.id);
  if (!Number.isFinite(dischargeId)) {
    return res.status(400).json({ error: "Invalid discharge id" });
  }

  const parsed = updateDischargeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const discharge = await prisma.dischargeSummary.update({
    where: { id: dischargeId },
    data: parsed.data
  });
  res.json(discharge);
});

dischargesRouter.delete("/:id", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const dischargeId = Number(req.params.id);
  if (!Number.isFinite(dischargeId)) {
    return res.status(400).json({ error: "Invalid discharge id" });
  }
  await prisma.dischargeSummary.delete({ where: { id: dischargeId } });
  res.json({ status: "deleted" });
});
