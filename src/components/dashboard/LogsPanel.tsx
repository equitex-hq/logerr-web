"use client";

import { useState, useEffect } from "react";

import { fetchLogs } from "@/lib/actions/logs";
import { LogEnvironment } from "@/lib/logerr/types";
import { formatLog } from "@/lib/logerr/utils";
import { Log } from "@/schemas/log";

export default function LogsPanel({ projectId }: { projectId?: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const logs = await fetchLogs({ projectId, limit: 10 });
        setLogs(logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [projectId]);

  if (loading) {
    return (
      <div>
        <span>Loading logs...</span>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div>
        <span>No logs found.</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg">
      <div>panel header</div>
      <div className="overflow-x-auto w-full border-t border-(--border) shadow">
        {logs.map((log) => (
          <div
            key={log.id}
            className="w-full px-4 text-neutral-500 bg-white dark:bg-neutral-900 font-mono">
            {formatLog({
              timestamp: log.timestamp,
              level: log.level,
              ...(log.service && { service: log.service }),
              message: log.message,
              environment: log.environment as LogEnvironment,
              metadata: log.metadata,
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
