import { z } from 'zod';

export const GoogleEventSchema = z.object({
  kind: z.literal('calendar#event'),
  etag: z.string(),
  id: z.string(),
  status: z.string(),
  htmlLink: z.string(),
  created: z.string(), // You may want to refine this validation based on your specific date format
  updated: z.string(), // You may want to refine this validation based on your specific date format
  summary: z.string(),
  description: z.string(),
  creator: z.object({
    email: z.string(),
    self: z.boolean()
  }),
  organizer: z.object({
    email: z.string(),
    self: z.boolean()
  }),
  start: z.object({
    dateTime: z.string(), // You may want to refine this validation based on your specific date format
    timeZone: z.string()
  }),
  end: z.object({
    dateTime: z.string(), // You may want to refine this validation based on your specific date format
    timeZone: z.string()
  }),
  iCalUID: z.string(),
  sequence: z.number(),
  reminders: z.object({
    useDefault: z.boolean()
  }),
  eventType: z.string()
});

export type EventSchemaType = z.infer<typeof GoogleEventSchema>;
