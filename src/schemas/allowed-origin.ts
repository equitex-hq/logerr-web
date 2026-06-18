import { z } from "zod";

/**
 * Validation schema for allowed origins.
 *
 * @property id - UUID v4 identifier
 * @property project_id - Project ID associated with the allowed origin
 * @property origin - Origin url
 * @property is_active - Whether the allowed origin is active
 * @property created_at - Timestamp of creation
 */
export const allowedOriginSchema = z.object({
  id: z.uuid(),
  project_id: z.uuid().optional(),
  origin: z.url(),
  is_active: z.boolean().optional(),
  created_at: z.iso.datetime({ offset: true }).optional(),
});

/**
 * Type inferred from allowedOriginSchema.
 *
 * @property id - UUID v4 identifier
 * @property project_id - Project ID associated with the allowed origin
 * @property origin - Origin url
 * @property is_active - Whether the allowed origin is active
 * @property created_at - Timestamp of creation
 */
export type AllowedOrigin = z.infer<typeof allowedOriginSchema>;
