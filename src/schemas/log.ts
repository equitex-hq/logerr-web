import { z } from "zod";

import { LOG_LEVELS } from "@/lib/logerr/constants";

/**
 * Validation schema for log entries.
 *
 * @property id - UUID v4 identifier
 * @property project_id - Project ID associated with the log (optional)
 * @property timestamp - Log timestamp
 * @property level - Log level
 * @property service - Service associated with the log (nullable)
 * @property message - Log message
 * @property environment - Environment of the log
 * @property metadata - Additional log metadata (optional)
 */
export const logSchema = z.object({
  id: z.uuid(),
  project_id: z.uuid().optional(),
  timestamp: z.iso.datetime({ offset: true }),
  level: z.enum(LOG_LEVELS),
  service: z.string().nullable(),
  message: z.string(),
  environment: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Type inferred from logSchema.
 *
 * @property id - UUID v4 identifier
 * @property project_id - Project ID associated with the log (optional)
 * @property timestamp - Log timestamp
 * @property level - Log level
 * @property service - Service associated with the log (nullable)
 * @property message - Log message
 * @property environment - Environment of the log
 * @property metadata - Additional log metadata (optional)
 */
export type Log = z.infer<typeof logSchema>;
