import { NextResponse, NextRequest } from "next/server";
import { code } from "../litActionCode.js";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK, LIT_RPC, LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessage,
  LitActionResource,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { AccessControlConditions } from "@lit-protocol/types";
import * as ethers from "ethers";
import process from "process";
import { tables } from "../constants";
process.config;

const ETHEREUM_PRIVATE_KEY = process.env["LIT_PRIVATE_KEY"]!;
const LIT_CAPACITY_CREDIT_TOKEN_ID =
  process.env["LIT_CAPACITY_CREDIT_TOKEN_ID"]!;

// @ts-ignore
import Hash from "ipfs-only-hash";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    signatures,
    newCid,
    ipns,
    ciphertext,
    dataToEncryptHash,
    instanceID,
    codeHash,
  } = body as {
    signatures: string[];
    newCid: string;
    ipns: string;
    ciphertext: string;
    dataToEncryptHash: string;
    instanceID: string;
    codeHash: string;
  };
  try {
    console.log("🚀 Starting Update IPNS process...");

    console.log("ipns", ipns);

    console.log("Instance ID:", instanceID);

    // Replace placeholders with provided values
    const litActionCode = code
      .replace("$ipns", `"${ipns.toString()}"`)
      .replace("$instanceID", `"${instanceID.toLowerCase()}"`)
    const ethersWallet = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    console.log("🔄 Connecting to the Lit network...");
    const litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilTest,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    console.log("Wallet Address:", ethersWallet.address);

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
          daysUntilUTCMidnightExpiration: 1,
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
          value: codeHash,
        },
      },
    ] satisfies AccessControlConditions;

    console.log("✅ Encrypted the IPNS Private Key");

    console.log("🔄 Getting the Session Signatures...");
    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      resourceAbilityRequests: [
        {
          resource: new LitActionResource("*"),
          ability: LIT_ABILITY.LitActionExecution,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: ethersWallet.address,
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });

        return await generateAuthSig({
          signer: ethersWallet,
          toSign,
        });
      },
    });
    console.log("✅ Generated the Session Signatures");

    console.log("🔄 Executing the Lit Action...");

    console.log(accessControlConditions);

    const litActionSignatures = await litNodeClient.executeJs({
      sessionSigs,
      code: litActionCode,
      jsParams: {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        newCid,
        signatures,
      },
    });
    console.log("✅ Executed the Lit Action", litActionSignatures);

    return NextResponse.json({
      litActionSignatures,
    });
  } catch (error) {
    console.error("update-ipns", error);
    return NextResponse.json({
      error: "Failed to update IPNS",
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: "end-to-end process",
    });
  }
}
