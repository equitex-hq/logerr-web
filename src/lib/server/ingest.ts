import "server-only";

import { hashApiKey } from "@/lib/server/api";
import { createClient } from "@/lib/supabase/server";

/**
 * Checks if the API key is valid.
 * @param apiKey API key to be validated
 * @param isSecret Whether the API key is secret or not
 * @returns True if the API key is valid; false otherwise
 */
export async function isValidApiKey(
  apiKey: string,
  isSecret: boolean,
): Promise<boolean> {
  const key = isSecret ? hashApiKey(apiKey) : apiKey;
  const column = isSecret ? "secret_api_key" : "public_api_key";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq(column, key)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to validate API key", { cause: error });
  }

  return !!data;
}
