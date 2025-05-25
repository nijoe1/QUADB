import { NextResponse, NextRequest } from "next/server";
import { code } from "../../../litActionCode.js";
// @ts-ignore
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { encryptString } from "@lit-protocol/encryption";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { AccessControlConditions } from "@lit-protocol/types";
import * as ethers from "ethers";
import * as Name from "w3name";
import process from "process";
process.config;

// @ts-ignore
import Hash from "ipfs-only-hash";
import { encodePacked, Hex } from "viem";

/**
 * Converts a Uint8Array or Buffer to a deterministic string representation
 * @param array The Uint8Array or Buffer to convert
 * @returns A base64 encoded string
 */

const getInstanceID = (instanceID: Hex, IPNS: string) => {
  const _newInstanceID = ethers.utils.keccak256(
    encodePacked(["bytes32", "string"], [instanceID, IPNS])
  );
  return _newInstanceID.toLowerCase();
};

function uint8ArrayToString(array: Uint8Array | Buffer): string {
  // Convert to base64 for reliable string representation
  return Buffer.from(array).toString("base64");
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ipfsCID, instanceID } = body as {
    ipfsCID: string;
    instanceID: Hex;
  };
  try {
    console.log("🚀 Starting Get Custom Lit Action Code process...");

    const name = await Name.create();

    console.log("🔄 Publishing the name...", name.toString());

    const codeID = getInstanceID(instanceID, name.toString());

    const litActionCode = code
      .replace("$ipns", `"${name.toString()}"`)
      .replace("$codeID", `"${codeID}"`);
    const litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: false,
    });

    console.log("🔄 Connecting to the Lit network...");
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    const hash = await Hash.of(litActionCode);

    console.log("🔄 Hash of the code:", hash);

    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":currentActionIpfsId"],
        returnValueTest: {
          comparator: "=",
          value: hash,
        },
      },
    ] satisfies AccessControlConditions;

    const revision = await Name.v0(name, ipfsCID);
    const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

    revision._validity = new Date(Date.now() + ONE_YEAR * 100).toISOString();

    await Name.publish(revision, name.key);

    const namePrivateKey = uint8ArrayToString(name.key.bytes);

    console.log("🔐 Encrypting IPNS Private Key...");

    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions,
        dataToEncrypt: namePrivateKey,
      },
      litNodeClient
    );

    console.log("✅ Encrypted the IPNS Private Key");

    return NextResponse.json({
      codeID,
      ipns: name.toString(),
      ciphertext,
      dataToEncryptHash,
      codeCID: hash,
    });
  } catch (error) {
    console.error("create-ipns", error);
    return NextResponse.json({
      error: "Failed to create IPNS",
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: "end-to-end process",
    });
  }
}
