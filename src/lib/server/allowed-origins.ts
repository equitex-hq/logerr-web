import "server-only";

import { LOGERR_ENVIRONMENT } from "@/lib/logerr/config";
import { createLogger } from "@/lib/logerr/server";
import { createClient } from "@/lib/supabase/server";
import { AllowedOrigin, allowedOriginSchema } from "@/schemas/allowed-origin";

const logger = createLogger("server:allowed-origins", LOGERR_ENVIRONMENT);

/**
 * Fetches allowed origins.
 * @param active Whether to fetch only active origins (default: `true`)
 * @param project_id Project ID
 * @returns Array of `AllowedOrigin` objects
 */
export async function getAllowedOrigins(
  active: boolean = true,
  project_id?: string,
): Promise<AllowedOrigin[]> {
  const supabase = await createClient();
  const query = supabase
    .from("allowed_origins")
    .select("id, origin")
    .eq("is_active", active);

  if (project_id) query.eq("project_id", project_id);

  const { data, error } = await query;

  if (error) {
    logger.error("Supabase error:", error);
    throw new Error("Failed to fetch allowed origins from Supabase");
  }

  const parsed = allowedOriginSchema.array().safeParse(data);
  if (!parsed.success) {
    logger.error("Zod validation error:", parsed.error);
    throw new Error("Invalid allowed origins data");
  }

  return parsed.data;
}

/**
 * Checks if an origin is allowed.
 * @param origin Origin to check
 * @returns `true` if the origin is allowed, `false` otherwise
 */
export async function isOriginAllowed(origin: string): Promise<boolean> {
  const allowed_origins = (await getAllowedOrigins()).map((o) => o.origin);
  return allowed_origins.includes(origin);
}

/**
 * Checks if an origin is allowed for a specific project.
 * @param origin Origin to check
 * @param project_id Project ID
 * @returns `true` if the origin is allowed for the project, `false` otherwise
 */
export async function isProjectOrigin(
  origin: string,
  project_id: string,
): Promise<boolean> {
  const allowed_origins = (await getAllowedOrigins(true, project_id)).map(
    (o) => o.origin,
  );

  return allowed_origins.includes(origin);
}
