import { z } from "zod";

/**
 * Validation schema for projects.
 *
 * @property id - UUID v4 identifier
 * @property name - Project name
 * @property public_api_key - Project public API key
 * @property secret_api_key - Project secret API key
 * @property created_at - Timestamp of creation
 */
export const projectSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  public_api_key: z.string().optional(),
  secret_api_key: z.string().optional(),
  created_at: z.iso.datetime({ offset: true }).optional(),
});

/**
 * Type inferred from projectSchema.
 *
 * @property id - UUID v4 identifier
 * @property name - Project name
 * @property public_api_key - Project public API key
 * @property secret_api_key - Project secret API key
 * @property created_at - Timestamp of creation
 */
export type Project = z.infer<typeof projectSchema>;
