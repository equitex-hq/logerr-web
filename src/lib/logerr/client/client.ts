import {
  LogEntry,
  LogEnvironment,
  LogLevel,
  LogMetadata,
} from "@/lib/logerr/types";
import { formatLog } from "@/lib/logerr/utils";

export function createBrowserClient(
  publicKey: string,
  options?: {
    service?: string;
    environment?: LogEnvironment;
  },
) {
  function createLog(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: options?.service,
      message,
      environment: options?.environment,
      metadata,
    };
  }

  function log(logEntry: LogEntry): void {
    const formattedMessage = formatLog(logEntry);

    if (logEntry.level === "info") {
      console.info(formattedMessage, logEntry.metadata || "");
    } else if (logEntry.level === "warn") {
      console.warn(formattedMessage, logEntry.metadata || "");
    } else if (logEntry.level === "error") {
      console.error(formattedMessage, logEntry.metadata || "");
    } else if (
      logEntry.level === "debug" &&
      options?.environment === "development"
    ) {
      console.debug(formattedMessage, logEntry.metadata || "");
    }
  }

  async function sendLogToApi(logEntry: LogEntry) {
    try {
      await fetch("https://logerr.equitex.dev/api/ingest/client", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": publicKey,
        },
        body: JSON.stringify(logEntry),
      });
    } catch {
      return;
    }
  }

  return {
    info: (message: string, metadata?: LogMetadata) => {
      const logEntry = createLog("info", message, metadata);
      void sendLogToApi(logEntry);
      log(logEntry);
    },
    warn: (message: string, metadata?: LogMetadata) => {
      const logEntry = createLog("warn", message, metadata);
      void sendLogToApi(logEntry);
      log(logEntry);
    },
    error: (message: string, metadata?: LogMetadata) => {
      const logEntry = createLog("error", message, metadata);
      void sendLogToApi(logEntry);
      log(logEntry);
    },
    debug: (message: string, metadata?: LogMetadata) => {
      const logEntry = createLog("debug", message, metadata);
      log(logEntry);
    },
    child: (childService: string) =>
      createBrowserClient(
        options?.service ? `${options?.service}:${childService}` : childService,
      ),
  };
}
