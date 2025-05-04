import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { instanceId, sequence, signatures } = await request.json();

    // Validate required fields
    if (!instanceId || !sequence || !signatures || !Array.isArray(signatures)) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: instanceId, sequence, and signatures array",
        },
        { status: 400 }
      );
    }

    // Insert the signature record
    const { data, error } = await supabase
      .from("signatures")
      .insert([
        {
          instance_id: instanceId,
          sequence: sequence,
          signatures: signatures,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting signature:", error);
      return NextResponse.json(
        { error: "Failed to insert signature", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in signatures API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceId = searchParams.get("instanceId");
    const sequence = searchParams.get("sequence");

    if (!instanceId || !sequence) {
      return NextResponse.json(
        { error: "Missing required query parameters: instanceId and sequence" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("signatures")
      .select("*")
      .eq("instance_id", instanceId)
      .eq("sequence", sequence)
      .single();

    if (error) {
      console.error("Error fetching signature:", error);
      return NextResponse.json(
        { error: "Failed to fetch signature", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in signatures API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { instanceId, sequence, signature } = await request.json();

    // Validate required fields
    if (!instanceId || !sequence || !signature) {
      return NextResponse.json(
        {
          error: "Missing required fields: instanceId, sequence, and signature",
        },
        { status: 400 }
      );
    }

    // First, get the existing record
    const { data: existingRecord, error: fetchError } = await supabase
      .from("signatures")
      .select("signatures")
      .eq("instance_id", instanceId)
      .eq("sequence", sequence)
      .single();

    if (fetchError) {
      console.error("Error fetching existing signatures:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to fetch existing signatures",
          details: fetchError.message,
        },
        { status: 500 }
      );
    }

    if (!existingRecord) {
      return NextResponse.json(
        { error: "No record found for the given instanceId and sequence" },
        { status: 404 }
      );
    }

    // Append the new signature to the existing array
    const updatedSignatures = [...existingRecord.signatures, signature];

    // Update the record with the new signatures array
    const { data, error } = await supabase
      .from("signatures")
      .update({ signatures: updatedSignatures })
      .eq("instance_id", instanceId)
      .eq("sequence", sequence)
      .select();

    if (error) {
      console.error("Error updating signatures:", error);
      return NextResponse.json(
        { error: "Failed to update signatures", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in signatures API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
