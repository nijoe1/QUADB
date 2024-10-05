import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import * as ethers from "ethers";

import { NextResponse, NextRequest } from "next/server";
interface DelegateRequestBody {
  delegateToAddress: string;
}
export async function POST(request: NextRequest) {
  const body: DelegateRequestBody = await request.json();

  const { delegateToAddress } = body;

  console.log("🔄 Delegate to Address", delegateToAddress);
  const ETHEREUM_PRIVATE_KEY = process.env.LIT_PRIVATE_KEY! as string;

  let capacityTokenId = "24097";
  let litNodeClient: LitNodeClient;

  try {
    const ethersSigner = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    console.log("🔄 Connecting LitNodeClient to Lit network...");
    litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilDev,
      debug: false,
      checkNodeAttestation: false,
      alertWhenUnauthorized: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected LitNodeClient to Lit network");

    // console.log("🔄 Connecting LitContracts client to network...");
    // const litContracts = new LitContracts({
    //   signer: ethersSigner,
    //   network: LitNetwork.Datil,
    //     debug: false,

    // });
    // await litContracts.connect();
    // console.log("✅ Connected LitContracts client to network");

    // if (!capacityTokenId) {
    //   console.log("🔄 Minting Capacity Credits NFT...");
    //   capacityTokenId = (
    //     await litContracts.mintCapacityCreditsNFT({
    //     //   requestsPerKilosecond: 10,
    //       daysUntilUTCMidnightExpiration: 5,
    //     })
    //   ).capacityTokenIdStr;
    //   console.log(`✅ Minted new Capacity Credit with ID: ${capacityTokenId}`);
    // }

    console.log("🔄 Creating capacityDelegationAuthSig...");
    const { capacityDelegationAuthSig } =
      await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersSigner,
        // capacityTokenId,
        delegateeAddresses: [delegateToAddress],
        // uses: "10",
      });
    console.log(`✅ Created the capacityDelegationAuthSig`);

    return NextResponse.json({ capacityDelegationAuthSig }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  } finally {
    litNodeClient!.disconnect();
  }
}
