import * as DID from "@ipld/dag-ucan/did";
import * as Signer from "@ucanto/principal/ed25519";
import * as Client from "@web3-storage/w3up-client";
import * as Proof from "@web3-storage/w3up-client/proof";
import { NextRequest, NextResponse } from "next/server";
import process from "process";

import { validateEnvironment } from "../fileUpload/utils";

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    validateEnvironment();

    const { did } = await request.json();

    // Load client with specific private key
    const principal = Signer.parse(process.env.KEY!);
    const client = await Client.create({ principal });

    // Add proof that this agent has been delegated capabilities on the space
    const proof = await Proof.parse(process.env.PROOF!);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());

    // Create a delegation for a specific DID
    const audience = DID.parse(did);

    // 10years from now
    const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10;
    const delegation = await client.createDelegation(audience, ["filecoin/info"], {
      expiration,
    });

    // Serialize the delegation and send it to the client
    const archive = await delegation.archive();

    return NextResponse.json(
      {
        success: true,
        archive: archive.ok,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
