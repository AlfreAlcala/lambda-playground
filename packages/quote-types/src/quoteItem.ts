// Generated by ts-to-zod
import { z } from "zod";

export const quoteItemSchema = z.object({
  quoteId: z.string(),
  amount: z.string(),
});

export type QuoteItem = z.infer<typeof quoteItemSchema>;