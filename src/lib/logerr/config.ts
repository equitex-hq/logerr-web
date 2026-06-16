import { ENVIRONMENT } from "@/config/shared";

/**
 * Current runtime environment of LogErr.
 *
 * Turns "preview" and "test" environment into "development".
 */
export const LOGERR_ENVIRONMENT =
  ENVIRONMENT === "preview" || ENVIRONMENT === "test"
    ? "development"
    : ENVIRONMENT;
