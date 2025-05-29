import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextResponse } from "next/server";
import process from "process";

const tables = {
  spaces: "db_spaces_314_70",
  spaceInstances: "db_spaces_instances_314_71",
  codes: "instances_codes_314_72",
  subscriptions: "subscriptions_314_73",
  members: "members_314_74",
};
// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const TablelandGateway = "https://tableland.network/api/v1/query?statement=";

const getInstanceMembers = async (instanceID: string) => {
  const query = `SELECT DISTINCT address FROM (
    SELECT member as address FROM ${tables.members} WHERE InstanceID = '${instanceID}'
    UNION ALL
    SELECT creator as address FROM ${tables.spaceInstances} WHERE InstanceID = '${instanceID}'
  )`;
  try {
    const result = await axios.get(TablelandGateway + encodeURIComponent(query));
    return result.data.map((member: { address: string }) => member.address) || [];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function POST(request: Request) {
  try {
    const { instanceId, sequence, signature, cid, proposalDescription, address } =
      await request.json();

    // Validate required fields
    if (!instanceId || !sequence || !signature || !cid || !address) {
      return NextResponse.json(
        {
          error: "Missing required fields: instanceId, sequence, signature, cid, and address",
        },
        { status: 400 },
      );
    }

    const instanceMembers = await getInstanceMembers(instanceId);

    if (!instanceMembers) {
      return NextResponse.json({ error: "Failed to fetch instance members" }, { status: 500 });
    }

    if (!instanceMembers.includes(address.toLowerCase())) {
      return NextResponse.json(
        { error: "Address is not a member of the instance" },
        { status: 400 },
      );
    }

    // Start a transaction
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .insert([
        {
          instance_id: instanceId,
          sequence: sequence,
          cid: cid,
          proposal_description: proposalDescription,
        },
      ])
      .select()
      .single();

    if (proposalError) {
      // If the error is due to unique constraint violation, get the existing proposal
      if (proposalError.code === "23505") {
        // Unique violation error code
        const { data: existingProposal } = await supabase
          .from("proposals")
          .select()
          .eq("instance_id", instanceId)
          .eq("sequence", sequence)
          .eq("cid", cid)
          .single();

        if (!existingProposal) {
          throw new Error("Failed to create or find proposal");
        }

        // Add signature to existing proposal
        const { data: signatureData, error: signatureError } = await supabase
          .from("signatures")
          .insert([
            {
              proposal_id: existingProposal.id,
              address: address,
              signature: signature,
            },
          ])
          .select();

        if (signatureError) {
          throw signatureError;
        }

        return NextResponse.json({
          success: true,
          data: {
            proposal: existingProposal,
            signature: signatureData,
          },
        });
      }
      throw proposalError;
    }

    // Add signature to new proposal
    const { data: signatureData, error: signatureError } = await supabase
      .from("signatures")
      .insert([
        {
          proposal_id: proposal.id,
          address: address,
          signature: signature,
        },
      ])
      .select();

    if (signatureError) {
      throw signatureError;
    }

    return NextResponse.json({
      success: true,
      data: {
        proposal,
        signature: signatureData,
      },
    });
  } catch (error) {
    console.error("Error in signatures API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceId = searchParams.get("instanceId");
    const sequence = searchParams.get("sequence");
    const cid = searchParams.get("cid");

    if (!instanceId || !sequence) {
      return NextResponse.json(
        { error: "Missing required query parameters: instanceId and sequence" },
        { status: 400 },
      );
    }

    let query = supabase
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
      .eq("sequence", sequence);

    // If cid is provided, filter by it
    if (cid) {
      query = query.eq("cid", cid);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching proposals:", error);
      return NextResponse.json(
        { error: "Failed to fetch proposals", details: error.message },
        { status: 500 },
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
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { instanceId, sequence, signature, cid, address } = await request.json();

    // Validate required fields
    if (!instanceId || !sequence || !signature || !cid || !address) {
      return NextResponse.json(
        {
          error: "Missing required fields: instanceId, sequence, signature, cid, and address",
        },
        { status: 400 },
      );
    }

    // Get the proposal
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select()
      .eq("instance_id", instanceId)
      .eq("sequence", sequence)
      .eq("cid", cid)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json(
        {
          error: "No proposal found for the given instanceId, sequence, and cid",
        },
        { status: 404 },
      );
    }

    // Check if signature already exists for this address
    const { data: existingSignature } = await supabase
      .from("signatures")
      .select()
      .eq("proposal_id", proposal.id)
      .eq("address", address)
      .single();

    if (existingSignature) {
      return NextResponse.json(
        {
          error: "Signature already exists for this address",
        },
        { status: 400 },
      );
    }

    // Add new signature
    const { data: signatureData, error: signatureError } = await supabase
      .from("signatures")
      .insert([
        {
          proposal_id: proposal.id,
          address: address,
          signature: signature,
        },
      ])
      .select();

    if (signatureError) {
      console.error("Error adding signature:", signatureError);
      return NextResponse.json(
        { error: "Failed to add signature", details: signatureError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        proposal,
        signature: signatureData,
      },
    });
  } catch (error) {
    console.error("Error in signatures API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
