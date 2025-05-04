import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { encryptString } from "@lit-protocol/encryption";
import { LIT_NETWORK, LIT_RPC, LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessage,
  LitAccessControlConditionResource,
  LitActionResource,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { AccessControlConditions } from "@lit-protocol/types";
import * as ethers from "ethers";
import * as Name from "w3name";
import { code as code2 } from "./thresholdRecovery.js";

// @ts-ignore
import Hash from "ipfs-only-hash";

const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY!;
const LIT_CAPACITY_CREDIT_TOKEN_ID =
  process.env["LIT_CAPACITY_CREDIT_TOKEN_ID"];
/**
 * Converts a Uint8Array or Buffer to a deterministic string representation
 * @param array The Uint8Array or Buffer to convert
 * @returns A base64 encoded string
 */
export function uint8ArrayToString(array: Uint8Array | Buffer): string {
  // Convert to base64 for reliable string representation
  return Buffer.from(array).toString("base64");
}

/**
 * Converts a string back to a Uint8Array
 * @param str The base64 encoded string
 * @returns A Uint8Array containing the original data
 */
export function stringToUint8Array(str: string): Uint8Array {
  // Convert from base64 back to Uint8Array
  return new Uint8Array(Buffer.from(str, "base64"));
}

export const decryptApiKey = async (
  customSignatures: string[] = [],
  customAddresses: string[] = [],
  customThreshold: number = 2
) => {
  // Fetch the compiled action with custom values
  // const code = await fetch(
  //   "http://localhost:3000/api/get-custom-lit-action-code",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       signatures: customSignatures,
  //       addresses: customAddresses,
  //       threshold: customThreshold,
  //     }),
  //   }
  // ).then((res) => {
  //   if (!res.ok) {
  //     throw new Error(`Failed to fetch custom lit action: ${res.statusText}`);
  //   }
  //   return res.text();
  // });

  let litNodeClient: LitNodeClient;

  try {
    const ethersWallet = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    console.log("🔄 Connecting to the Lit network...");
    litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilTest,
      debug: false,
    });
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
          requestsPerKilosecond: 10,
          daysUntilUTCMidnightExpiration: 1,
        })
      ).capacityTokenIdStr;
      console.log(`✅ Minted new Capacity Credit with ID: ${capacityTokenId}`);
    } else {
      console.log(
        `ℹ️  Using provided Capacity Credit with ID: ${LIT_CAPACITY_CREDIT_TOKEN_ID}`
      );
    }

    console.log("🔄 Creating capacityDelegationAuthSig...");
    const { capacityDelegationAuthSig } =
      await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersWallet,
        capacityTokenId,
        delegateeAddresses: [ethersWallet.address],
        uses: "1",
      });
    console.log("✅ Capacity Delegation Auth Sig created");
    const hash = await Hash.of(code2);

    console.log("🔄 Hash of the code:", hash);

    // - ipns: the ipns record to check
    // - newCid: the new cid to check
    // - signatures: the signatures to check
    // - addresses: the addresses to check
    // - threshold: the threshold to check
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
    ] as AccessControlConditions;

    console.log("🔐 Encrypting the API key...");
    // Create a new w3name record
    // value is an IPFS path to the content we want to publish
    const value =
      "/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui";

    const name = await Name.create();

    console.log("🔄 Publishing the name...", name.toString());

    const revision = await Name.v0(name, value);
    await Name.publish(revision, name.key);

    const namePrivateKey = uint8ArrayToString(name.key.bytes);

    console.log("🔐 Encrypted the API key");

    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions,
        dataToEncrypt: namePrivateKey,
      },
      litNodeClient
    );
    console.log("✅ Encrypted the API key");
    console.log("ℹ️  The base64-encoded ciphertext:", ciphertext);
    console.log(
      "ℹ️  The hash of the data that was encrypted:",
      dataToEncryptHash
    );

    // console.log("🔄 Generating the Resource String...");
    // const accsResourceString =
    //   await LitAccessControlConditionResource.generateResourceString(
    //     accessControlConditions as any,
    //     dataToEncryptHash
    //   );
    console.log("✅ Generated the Resource String");

    console.log("🔄 Getting the Session Signatures...");
    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      capabilityAuthSigs: [capacityDelegationAuthSig],
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      resourceAbilityRequests: [
        // {
        //   resource: new LitAccessControlConditionResource(accsResourceString),
        //   ability: LIT_ABILITY.AccessControlConditionDecryption,
        // },
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

    const newValue =
      "/ipfs/QmbvaY7XSZuggS23b5XwBKaZzMHsydeg1FmHV5YigYUYMq/code.txt";

    // const InitIPNS = await litNodeClient.executeJs({
    //   sessionSigs,
    //   // read the contents of the file bundled.js
    //   code,
    //   jsParams: {
    //     accessControlConditions,
    //     // ciphertext,
    //     // dataToEncryptHash,
    //     // ipns: name.toString(),
    //     // newCid: newValue,
    //     cid: newValue,
    //     // signatures: [],
    //     // addresses: [],
    //     // threshold: 0,
    //   },
    // });
    // console.log("✅ Executed the Lit Action", InitIPNS);

    // const { ciphertext, dataToEncryptHash, IPNS } =
    //   InitIPNS?.response && typeof InitIPNS.response === "string"
    //     ? JSON.parse(InitIPNS.response)
    //     : { ciphertext: "", dataToEncryptHash: "", IPNS: "" };

    const litActionSignatures = await litNodeClient.executeJs({
      sessionSigs,
      // read the contents of the file bundled.js
      code: code2,
      jsParams: {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        ipns: name.toString(),
        newCid: newValue,
        // cid: newValue,
        signatures: [],
        // addresses: [],
        threshold: 0,
      },
    });
    console.log("✅ Executed the Lit Action", litActionSignatures);

    return litActionSignatures;
  } catch (error) {
    console.error(error);
  } finally {
    litNodeClient!.disconnect();
  }
};

// Example of how to call the function with custom values
// Usage example:
//
// const signatures = [
//   "0x123abc...",  // Signature from first signer
//   "0x456def..."   // Signature from second signer
// ];
//
// const addresses = [
//   "0xabc123...",  // Address of first signer
//   "0xdef456..."   // Address of second signer
// ];
//
// const threshold = 2;  // Require at least 2 valid signatures
//
// decryptApiKey(signatures, addresses, threshold)
//   .then(result => console.log("Action executed:", result))
//   .catch(error => console.error("Error:", error));
