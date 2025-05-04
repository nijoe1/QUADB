import { NextResponse, NextRequest } from "next/server";
import { code } from "../litActionCode.js";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { encryptString } from "@lit-protocol/encryption";
import { LIT_NETWORK, LIT_RPC, LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessage,
  LitActionResource,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { AccessControlConditions } from "@lit-protocol/types";
import * as ethers from "ethers";
import * as Name from "w3name";
import process from "process";
process.config;

const ETHEREUM_PRIVATE_KEY = process.env["LIT_PRIVATE_KEY"]!;
const LIT_CAPACITY_CREDIT_TOKEN_ID =
  process.env["LIT_CAPACITY_CREDIT_TOKEN_ID"]!;

// @ts-ignore
import Hash from "ipfs-only-hash";
import { encodePacked, Hex, zeroHash } from "viem";

/**
 * Converts a Uint8Array or Buffer to a deterministic string representation
 * @param array The Uint8Array or Buffer to convert
 * @returns A base64 encoded string
 */

const tables = {
  spaces: "db_spaces_314_60",
  spaceInstances: "db_spaces_instances_314_61",
  codes: "instances_codes_314_62",
  subscriptions: "subscriptions_314_63",
  members: "members_314_64",
};

const getInstanceID = (instanceID: Hex, IPNS: string) => {
  const _newInstanceID = ethers.utils.keccak256(
    encodePacked(["bytes32", "string"], [instanceID, IPNS])
  );
  return _newInstanceID;
};

function uint8ArrayToString(array: Uint8Array | Buffer): string {
  // Convert to base64 for reliable string representation
  return Buffer.from(array).toString("base64");
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { threshold, ipfsCID, spaceID } = body as {
    threshold: number;
    ipfsCID: string;
    spaceID: Hex;
  };
  try {
    console.log("🚀 Starting Get Custom Lit Action Code process...");

    if (threshold === undefined || typeof threshold !== "number") {
      return NextResponse.json(
        { error: "threshold must be a number" },
        { status: 400 }
      );
    }

    const name = await Name.create();

    console.log("🔄 Publishing the name...", name.toString());

    const instanceID = getInstanceID(spaceID, name.toString());
    // Replace placeholders with provided values
    const litActionCode = code
      .replace("$threshold", threshold.toString())
      .replace("$ipns", `"${name.toString()}"`)
      .replace("$instanceID", `"${instanceID}"`)
      .replace("$tables", JSON.stringify(tables));
    const litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilTest,
      debug: false,
    });

    const ethersWallet = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    console.log("🔄 Connecting to the Lit network...");
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    console.log("🔄 Connecting LitContracts client to network...");
    const litContracts = new LitContracts({
      signer: ethersWallet,
      network: LIT_NETWORK.DatilTest,
      debug: false,
    });
    await litContracts.connect();
    console.log("✅ Connected LitContracts client to network");

    let capacityTokenId = LIT_CAPACITY_CREDIT_TOKEN_ID;
    if (capacityTokenId === "" || capacityTokenId === undefined) {
      console.log("🔄 No Capacity Credit provided, minting a new one...");
      capacityTokenId = (
        await litContracts.mintCapacityCreditsNFT({
          requestsPerKilosecond: 100,
          daysUntilUTCMidnightExpiration: 365,
        })
      ).capacityTokenIdStr;
      console.log(`✅ Minted new Capacity Credit with ID: ${capacityTokenId}`);
    } else {
      console.log(
        `ℹ️  Using provided Capacity Credit with ID: ${LIT_CAPACITY_CREDIT_TOKEN_ID}`
      );
    }
    console.log("✅ Capacity Delegation Auth Sig created");
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
      instanceID,
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
