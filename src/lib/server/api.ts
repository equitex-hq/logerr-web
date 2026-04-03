import "server-only";

import { createHash, randomBytes } from "crypto";

/**
 * Generates a new API key with the given prefix.
 * @param prefix API key prefix
 * @returns Generated API key in the format {prefix}_{random}
 */
export function generateApiKey(prefix: string): string {
  const random = randomBytes(16).toString("hex");
  return `${prefix}_${random}`;
}

/**
 * Hashes API key using SHA-256.
 * @param apiKey API key to hash
 * @returns Hashed API key as a hexadecimal string
 */
export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}
