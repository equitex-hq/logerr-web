import { createBrowserClient } from "@/lib/logerr/client/client";
import { LogEnvironment } from "@/lib/logerr/types";

export function createLogger(service?: string, environment?: string) {
  return createBrowserClient(process.env.NEXT_PUBLIC_LOGERR_PUBLIC_KEY!, {
    service,
    environment: environment as LogEnvironment,
  });
}
