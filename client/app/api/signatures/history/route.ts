import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceId = searchParams.get("instanceId");

    if (!instanceId) {
      return NextResponse.json(
        { error: "Missing required query parameter: instanceId" },
        { status: 400 }
      );
    }

    // Get all proposals for this instance, ordered by sequence
    const { data, error } = await supabase
      .from("proposals")
      .select(
        `
        *,
        signatures (
          id,
          address,
          signature,
          created_at
        )
      `
      )
      .eq("instance_id", instanceId)
      .order("sequence", { ascending: false });

    if (error) {
      console.error("Error fetching proposal history:", error);
      return NextResponse.json(
        { error: "Failed to fetch proposal history", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in signatures history API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
