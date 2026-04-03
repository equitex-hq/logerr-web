import { NextRequest, NextResponse } from "next/server";

import { UnauthorizedError } from "@/lib/errors";
import { createLogger } from "@/lib/logerr/server";
import { hashApiKey } from "@/lib/server/api";
import { createClient } from "@/lib/supabase/server";

const debugLogger = createLogger("api:ingest", "development");

export async function POST(request: NextRequest) {
  debugLogger.debug("Log entry received", {
    method: request.method,
    url: request.url,
  });

  try {
    const body = await request.json();
    const secret_key = request.headers.get("x-api-key");

    if (!secret_key) {
      throw new UnauthorizedError("Missing API key");
    }

    const hash = hashApiKey(secret_key);
    const supabase = await createClient();
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("secret_api_key", hash)
      .single();
    if (projectError || !project) {
      throw new UnauthorizedError("Invalid API key");
    }

    const { error: insertError } = await supabase.from("logs").insert({
      project_id: project.id,
      timestamp: body.timestamp,
      level: body.level,
      service: body.service,
      message: body.message,
      environment: body.environment,
      meta: body.metadata,
    });

    if (insertError) {
      throw new Error("Failed to insert log entry into database");
    }

    return NextResponse.json({ status: 201 });
  } catch (error) {
    debugLogger.debug("Error occurred while processing log entry", { error });

    // Unauthorized Error
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Internal Server Error
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
