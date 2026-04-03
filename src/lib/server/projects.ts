import "server-only";

import { createLogger } from "@/lib/logerr/server";
import { createClient } from "@/lib/supabase/server";
import { Project, projectSchema } from "@/schemas/project";

const logger = createLogger("backend:projects", "production");

/**
 * Fetches all projects.
 * @returns Array of `Project` objects
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    logger.error("Supabase error:", error);
    throw new Error("Failed to fetch projects from Supabase");
  }

  const parsed = projectSchema.array().safeParse(data);
  if (!parsed.success) {
    logger.error("Zod validation error:", parsed.error);
    throw new Error("Invalid projects data");
  }

  return parsed.data;
}

export async function getProjectById(projectId: string): Promise<Project> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    logger.error("Supabase error:", error);
    throw new Error("Failed to fetch project from Supabase");
  }

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    logger.error("Zod validation error:", parsed.error);
    throw new Error("Invalid project data");
  }

  return parsed.data;
}
