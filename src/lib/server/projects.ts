import "server-only";

import { createClient } from "@/lib/supabase/server";
import { Project, projectSchema } from "@/schemas/project";

/**
 * Fetches all projects.
 * @returns Array of `Project` objects
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to fetch projects from Supabase");
  }

  const parsed = projectSchema.array().safeParse(data);
  if (!parsed.success) {
    console.error("Zod validation error:", parsed.error);
    throw new Error("Invalid projects data");
  }

  console.info("Successfully fetched projects");
  return parsed.data;
}
