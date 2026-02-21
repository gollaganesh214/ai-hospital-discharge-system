import { z } from "zod";

export const createLabSchema = z.object({
  patientId: z.number().int().positive(),
  testName: z.string().min(2),
  result: z.string().min(1),
  unit: z.string().optional(),
  normalRange: z.string().optional(),
  status: z.string().optional(),
  collectedAt: z.coerce.date().optional(),
  reportedAt: z.coerce.date().optional()
});

export const updateLabSchema = createLabSchema.partial();
