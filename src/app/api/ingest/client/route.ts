import { NextRequest, NextResponse } from "next/server";

import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import { isOriginAllowed, isProjectOrigin } from "@/lib/server/allowed-origins";
import { isValidApiKey } from "@/lib/server/ingest";
import { getProjectByApikey } from "@/lib/server/projects";
import { createClient } from "@/lib/supabase/server";

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");

  if (!origin) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        Allow: "POST, OPTIONS",
      },
    });
  }

  if (await isOriginAllowed(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        Vary: "Origin",
      },
    });
  }

  return new NextResponse(null, {
    status: 403,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const origin = request.headers.get("origin");
    const public_key = request.headers.get("x-api-key");
    const body = await request.json();

    if (!origin) {
      throw new ForbiddenError("Missing Origin header");
    }

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

    const is_allowed = await isProjectOrigin(origin, project.id);
    if (!is_allowed) {
      throw new ForbiddenError("Access denied");
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

    return NextResponse.json(
      { success: true },
      {
        headers: {
          Origin: origin,
          Vary: "Origin",
        },
      },
    );
  } catch (error) {
    // Unauthorized Error
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Forbidden Error
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    // Internal Server Error
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
