import { LogEntry } from "@/lib/logerr/types";

/**
 * Formats a log entry into a string for console output.
 * @param logEntry Log entry to be formatted
 * @returns Formatted log string
 */
export function formatLog(logEntry: LogEntry): string {
  const { timestamp, level, service, message } = logEntry;
  const serviceStr = service ? ` (${service})` : "";
  return `${timestamp} [${level.toUpperCase()}]${serviceStr} ${message}`;
}
