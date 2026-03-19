import { z } from "zod";

export const statusResponseSchema = z.object({
  status: z.literal("ok"),
});

export type StatusResponse = z.infer<typeof statusResponseSchema>;
