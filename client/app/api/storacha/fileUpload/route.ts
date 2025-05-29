import * as Client from "@web3-storage/w3up-client";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import { NextRequest, NextResponse } from "next/server";
import process from "process";

import { encodeFile } from "@/app/api/storacha/lib/unixfs";

import { getPieceMetadata, getParsedMetadata } from "../lib/getPieceMetadata";
import {
  createServerFile,
  modifyFile,
  getExtensionFromMimeType,
  validateEnvironment,
  validateFile,
} from "./utils";

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    validateEnvironment();

    // Extract the file from the request
    const form = await request.formData();
    const file = form.get("file") as unknown as File;

    // Validate the file
    validateFile(file);

    // Setup the client
    const principal = Signer.parse(process.env.KEY!);
    const store = new StoreMemory();
    const client = await Client.create({ principal, store });

    // Delegate access to the server
    const proof = await Proof.parse(process.env.PROOF!);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());

    const pieceMetadata = getParsedMetadata(await getPieceMetadata(file));

    const dataFileCID = (await encodeFile(file)).cid;

    const fileExtension = getExtensionFromMimeType(file.type);

    const dataFileName = `data.${fileExtension}`;

    // Create metadata JSON content
    const metadataContent = JSON.stringify(
      {
        name: file.name,
        path: dataFileName,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        uploadedAt: new Date().toISOString(),
        pieceMetadata,
        dataCID: dataFileCID.toString(),
      },
      null,
      2,
    );

    // Create a server-compatible file object for the metadata
    const metadataFile = createServerFile(metadataContent, `metadata.json`, {
      type: "application/json",
    });

    const dataFile = await modifyFile(file, dataFileName, file.type);

    // Upload the file on Storacha
    const cid = "/ipfs/" + (await client.uploadDirectory([metadataFile, dataFile])).toString();

    // Return the CID and additional metadata
    return NextResponse.json(
      {
        success: true,
        cid,
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
