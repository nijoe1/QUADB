import { NextResponse, NextRequest } from "next/server";
import { code } from "@/app/api/lit/actions/code.js";
// @ts-ignore
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK, LIT_RPC, LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessage,
  LitActionResource,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { AccessControlConditions } from "@lit-protocol/types";
import * as ethers from "ethers";
import process from "process";
process.config;

const ETHEREUM_PRIVATE_KEY = process.env["LIT_PRIVATE_KEY"]!;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    signature,
    newCid,
    ipns,
    ciphertext,
    dataToEncryptHash,
    codeID,
    codeHash,
  } = body as {
    signature: string;
    newCid: string;
    ipns: string;
    ciphertext: string;
    dataToEncryptHash: string;
    codeID: string;
    codeHash: string;
  };
  try {
    console.log("🚀 Starting Update IPNS process...");

    const litActionCode = code
      .replace("$ipns", `"${ipns.toString()}"`)
      .replace("$codeID", `"${codeID.toLowerCase()}"`);
    const ethersWallet = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    console.log("🔄 Connecting to the Lit network...");
    const litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

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

    const litActionSignatures = await litNodeClient.executeJs({
      sessionSigs,
      code: litActionCode,
      jsParams: {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        newCid,
        signature,
      },
    });

    const response = JSON.parse(litActionSignatures.response as string);

    return NextResponse.json({
      success: response.success,
      message: response.message,
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
