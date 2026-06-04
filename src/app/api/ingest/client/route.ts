import { NextRequest, NextResponse } from "next/server";

import { UnauthorizedError } from "@/lib/errors";
import { isValidApiKey } from "@/lib/server/ingest";
import { createClient } from "@/lib/supabase/server";
import { isProjectOriginAllowed } from "@/lib/server/origins";
import { getProjectByApikey } from "@/lib/server/projects";

const ALLOWED_METHODS = "POST, OPTIONS";
const ALLOWED_HEADERS = "content-type, x-api-key";

function buildCorsHeaders(origin: string | null): Headers {
  const headers = new Headers();

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  headers.set("Access-Control-Max-Age", "86400");

  return headers;
}

function withCors(response: NextResponse, origin: string | null): NextResponse {
  const corsHeaders = buildCorsHeaders(origin);

  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log("Received log entry");

  const requestOrigin = request.headers.get("origin");

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

    const requestOriginHeader = requestOrigin ?? request.headers.get("referer");
    if (!(await isProjectOriginAllowed(project.id, requestOriginHeader))) {
      throw new UnauthorizedError("Origin not allowed for this project");
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

    return withCors(NextResponse.json({ success: true }), requestOrigin);
  } catch (error) {
    // Unauthorized Error
    if (error instanceof UnauthorizedError) {
      return withCors(
        NextResponse.json({ error: error.message }, { status: 401 }),
        requestOrigin,
      );
    }

    // Internal Server Error
    return withCors(
      NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
      requestOrigin,
    );
  }
}
