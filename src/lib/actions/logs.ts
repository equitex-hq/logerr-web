"use server";

import { getLogs } from "@/lib/server/logs";
import { Log } from "@/schemas/log";

export async function fetchLogs(
  options: {
    projectId?: string;
    cursor?: string;
    limit?: number;
  } = {},
): Promise<Log[]> {
  return getLogs(options);
}
