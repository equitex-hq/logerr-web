import { createBrowserClient } from "@/lib/logerr/client/client";
import { LogEnvironment } from "@/lib/logerr/types";

/**
 * Creates a client-side logger instance.
 *
 * @param service Service associated with the logger
 * @param environment Environment where the logger is used (default: "development")
 * @returns Client-side logger instance
 */
export function createLogger(
  service?: string,
  environment: LogEnvironment = "development",
) {
  return createBrowserClient(process.env.NEXT_PUBLIC_LOGERR_PUBLIC_KEY!, {
    service,
    environment: environment as LogEnvironment,
  });
}
