import { createServerClient } from "@/lib/logerr/server/server";
import { LogEnvironment } from "@/lib/logerr/types";

/**
 * Creates a server-side logger instance.
 *
 * @param service Service associated with the logger
 * @param environment Environment where the logger is used (default: "development")
 * @returns Server-side logger instance
 */
export function createLogger(
  service?: string,
  environment: LogEnvironment = "development",
) {
  return createServerClient(process.env.LOGERR_SECRET_KEY!, {
    service,
    environment: environment as LogEnvironment,
  });
}
