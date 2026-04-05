import { NextRequest, NextResponse } from "next/server";

import { UnauthorizedError } from "@/lib/errors";
import { isValidApiKey } from "@/lib/server/ingest";
import { getProjectByApikey } from "@/lib/server/projects";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const public_key = request.headers.get("x-api-key");

    if (!public_key) {
      throw new UnauthorizedError("Missing API key");
    }

    if (!(await isValidApiKey(public_key, false))) {
      throw new UnauthorizedError("Invalid API key");
    }

    const project = await getProjectByApikey(public_key, false);
    if (!project) {
      throw new UnauthorizedError("Project not found for the provided API key");
    }

    const supabase = await createClient();
    const { error } = await supabase.from("logs").insert({
      project_id: project.id,
      timestamp: body.timestamp,
      level: body.level,
      service: body.service,
      message: body.message,
      environment: body.environment,
      meta: body.metadata,
    });

    if (error) {
      throw new Error("Failed to insert log entry into database", {
        cause: error,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
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
