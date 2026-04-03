import "server-only";

import { createLogger } from "@/lib/logerr/server";
import { createClient } from "@/lib/supabase/server";
import { Log, logSchema } from "@/schemas/log";

const logger = createLogger("backend:logs", "production");

/**
 * Fetches logs with optional filtering.
 *
 * @param options Filtering options:
 * - `projectId`: Project ID
 * - `cursor`: Timestamp cursor for pagination (fetch logs before this timestamp)
 * - `limit`: Number of logs to fetch (default: 20)
 * @returns Array of `Log` objects
 */
export async function getLogs(
  options: {
    projectId?: string;
    cursor?: string;
    limit?: number;
  } = {},
): Promise<Log[]> {
  const { projectId, cursor, limit = 20 } = options;

  const supabase = await createClient();
  const query = supabase
    .from("logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (projectId) query.eq("project_id", projectId);
  if (cursor) query.lt("timestamp", cursor);

  const { data, error } = await query;

  if (error) {
    logger.error("Supabase error:", error);
    throw new Error("Failed to fetch logs from Supabase");
  }

  const parsed = logSchema.array().safeParse(data);
  if (!parsed.success) {
    logger.error("Zod validation error:", parsed.error);
    throw new Error("Invalid logs data");
  }

  return parsed.data;
}
