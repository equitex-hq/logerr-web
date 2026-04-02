import { createServerClient } from "@/lib/logerr/server/server";
import { LogEnvironment } from "@/lib/logerr/types";

export function createLogger(service?: string, environment?: string) {
  return createServerClient(process.env.LOGERR_SECRET_KEY!, {
    service,
    environment: environment as LogEnvironment,
  });
}
