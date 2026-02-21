import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.string().min(3)
});
