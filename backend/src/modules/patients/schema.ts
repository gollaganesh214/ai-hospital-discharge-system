import { z } from "zod";

export const createPatientSchema = z.object({
  mrn: z.string().min(3),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z.coerce.date(),
  gender: z.string().optional()
});

export const updatePatientSchema = createPatientSchema.partial();
