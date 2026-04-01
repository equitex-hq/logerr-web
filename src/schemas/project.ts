import { z } from "zod";

/**
 * Validation schema for projects.
 *
 * @property id - UUID v4 identifier
 * @property name - Project name
 * @property api_key - Project API key
 * @property created_at - Timestamp of creation
 */
export const projectSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  api_key: z.string().optional(),
  created_at: z.iso.datetime({ offset: true }).optional(),
});

/**
 * Type inferred from projectSchema.
 *
 * @property id - UUID v4 identifier
 * @property name - Project name
 * @property api_key - Project API key
 * @property created_at - Timestamp of creation
 */
export type Project = z.infer<typeof projectSchema>;
