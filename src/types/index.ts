import { z } from "zod";

export const shortenUrlSchema = z.object({
    originalUrl: z.string().url(),
    customCode: z.string().min(3).max(20).optional(),
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;