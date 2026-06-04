import { createClient } from "../supabase/server";

function normalizeOrigin(origin: string): string {
  try {
    return new URL(origin).origin;
  } catch {
    return origin;
  }
}

/**
 * Fetches allowed origins for a project.
 * @param project_id Project ID to fetch allowed origins for
 * @returns Array of allowed origins
 */
export async function getProjectAllowedOrigins(project_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("allowed_origins")
    .select("origin")
    .eq("project_id", project_id);

  if (error) {
    console.error("Error fetching allowed origins:", error);
    return [];
  }

  return data.map((origin) => origin.origin);
}

export async function isProjectOriginAllowed(
  project_id: string,
  requestOrigin: string | null,
): Promise<boolean> {
  if (!requestOrigin) {
    return false;
  }

  const allowedOrigins = await getProjectAllowedOrigins(project_id);
  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);

  return allowedOrigins.some(
    (origin) => normalizeOrigin(origin) === normalizedRequestOrigin,
  );
}
