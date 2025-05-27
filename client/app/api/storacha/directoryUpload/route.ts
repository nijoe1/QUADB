import * as Client from "@web3-storage/w3up-client";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Extract the file from the request
    const form = await request.formData();
    const files: File[] = [];

    //  sum of files size
    let totalSize = 0;

    form.forEach((value, key) => {
      if (key === "files[]" && value instanceof Blob) {
        files.push(value);
        totalSize += value.size;
      }
    });

    //  if total size is greater than 1MB, return error
    if (totalSize > 1 * 1024 * 1024) {
      return NextResponse.json({ error: "Total size is greater than 1MB" }, { status: 400 });
    }

    // Setup the client
    const principal = Signer.parse(process.env.KEY!);
    const store = new StoreMemory();
    const client = await Client.create({ principal, store });

    // Delegate access to the server
    const proof = await Proof.parse(process.env.PROOF!);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());

    // Upload the file on Storacha
    const cid = await client.uploadDirectory(files);

    // Return the CID
    return NextResponse.json({ cid: cid.toString() }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
