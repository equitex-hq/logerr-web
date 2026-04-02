/**
 * Available log environments.
 */
export type LogEnvironment = "production" | "development";

/**
 * Available log levels for logger.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Log metadata type.
 */
export type LogMetadata = Record<string, unknown> | Error;

/**
 * Structure of a log entry.
 *
 * @property timestamp - Log timestamp
 * @property level - Log level
 * @property service - Service associated with the log (optional)
 * @property message - Log message
 * @property environment - Environment of the log (optional)
 * @property metadata - Additional log metadata (optional)
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service?: string;
  message: string;
  environment?: LogEnvironment;
  metadata?: LogMetadata;
}
