import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Hex } from "viem";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instanceId } = body as {
      instanceId: Hex;
    };

    if (!instanceId) {
      return NextResponse.json(
        { error: "Missing required query parameter: instanceId" },
        { status: 400 },
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
      `,
      )
      .eq("instance_id", instanceId)
      .order("sequence", { ascending: false });

    if (error) {
      console.error("Error fetching proposal history:", error);
      return NextResponse.json(
        { error: "Failed to fetch proposal history", details: error.message },
        { status: 500 },
      );
    }
    console.log(data);
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error("Error in signatures history API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
