import { z } from "zod";

export const createDischargeSchema = z.object({
  admissionId: z.number().int().positive(),
  finalDiagnosis: z.string().min(3),
  keyFindings: z.string().min(3),
  medications: z.string().min(3),
  followUp: z.string().min(3)
});

export const updateDischargeSchema = z.object({
  summaryText: z.string().min(3).optional(),
  medications: z.string().min(3).optional(),
  followUp: z.string().min(3).optional()
});
