import { LOG_ENVIRONMENTS, LOG_LEVELS } from "@/lib/logerr/constants";

/**
 * Type representing allowed log environments.
 */
export type LogEnvironment = (typeof LOG_ENVIRONMENTS)[number];

/**
 * Type representing allowed log levels.
 */
export type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Type representing log metadata.
 */
export type LogMetadata = Record<string, unknown> | Error;

/**
 * Structure of a log entry.
 *
 * @property timestamp - Log timestamp
 * @property level - Log level
 * @property service - Service associated with the log (optional)
 * @property message - Log message
 * @property environment - Environment of the log
 * @property metadata - Additional log metadata (optional)
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service?: string;
  message: string;
  environment: LogEnvironment;
  metadata?: LogMetadata;
}
