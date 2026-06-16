/**
 * Current runtime environment.
 *
 * Determined from `NODE_ENV` and `NEXT_PUBLIC_VERCEL_ENV` environment variables.
 */
export const ENVIRONMENT =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "preview"
    : process.env.NODE_ENV;
