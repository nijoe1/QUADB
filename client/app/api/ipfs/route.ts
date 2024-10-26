import { NextResponse, NextRequest } from "next/server";

import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import * as Proof from "@web3-storage/w3up-client/proof";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const file = form.get("file") as unknown as File;
    const principal = Signer.parse(process.env.KEY!);
    const store = new StoreMemory();
    const client = await Client.create({ principal, store });
    // Add proof that this agent has been delegated capabilities on the space
    //   REMOVE ANY SPACE FROM THE PROOF STRING
    const proof = await Proof.parse(process.env.PROOF!);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());
    const directoryCid = await client.uploadFile(file);
    return NextResponse.json({ cid: directoryCid.toString() }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
