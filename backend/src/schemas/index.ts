import { z } from "zod";

export const createSectorSchema = z.object({
  name: z.string(),
  workstations: z.array(
    z.object({
      name: z.string(),
      order: z.number(),
    })
  ),
});
