import { z } from "zod";

export const createAdmissionSchema = z.object({
  patientId: z.number().int().positive(),
  diagnosis: z.string().min(3),
  attendingPhysician: z.string().min(3)
});

export const updateAdmissionSchema = createAdmissionSchema.partial();
