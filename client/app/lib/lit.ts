import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import {
  AccsEVMParams,
  AccessControlConditions,
  EncryptToJsonPayload,
} from "@lit-protocol/types";
import { ethers } from "ethers";
import {
  LitAccessControlConditionResource,
  LitAbility,
  generateAuthSig,
  createSiweMessage,
  AuthSig,
} from "@lit-protocol/auth-helpers";
import { CONTRACT_ADDRESS_BY_NETWORK as Contracts } from "@/app/constants/contracts";

import { LPACC_EVM_CONTRACT } from "./types";
import { config } from "dotenv";
config();
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "filecoin",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000", // 0.000001 ETH
    },
  },
];
export class Lit {
  contractAddress: string;
  litNodeClient: LitJsSdk.LitNodeClient;
  chain;
  instanceID: string | undefined;
  constructor(chain: string, instanceID?: string) {
    this.chain = chain;
    this.litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: LitNetwork.Datil,
    });
    this.litNodeClient.disconnect();
    this.instanceID = instanceID;
    this.contractAddress =
      chain === "filecoin"
        ? Contracts[314]
        : chain === "filecoin"
          ? Contracts[314159]
          : "";
  }

  private viewAccessControlConditions():
    | AccsEVMParams[]
    | LPACC_EVM_CONTRACT[] {
    return [
      {
        contractAddress: this.contractAddress,
        chain: this.chain as LPACC_EVM_CONTRACT["chain"],
        functionName: "hasViewAccess",
        functionParams: [this.instanceID ?? "", ":userAddress"],
        functionAbi: {
          name: "hasViewAccess",
          stateMutability: "view",
          inputs: [
            {
              name: "_instance",
              type: "bytes32",
            },
            {
              name: "_sender",
              type: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
        },
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
    ];
  }

  private mutateAccessControlConditions():
    | AccsEVMParams[]
    | LPACC_EVM_CONTRACT[] {
    return [
      {
        contractAddress: this.contractAddress,
        chain: this.chain as LPACC_EVM_CONTRACT["chain"],
        functionName: "hasMutateAccess",
        functionParams: [this.instanceID ?? "", ":userAddress"],
        functionAbi: {
          name: "hasMutateAccess",
          stateMutability: "view",
          inputs: [
            {
              name: "_instance",
              type: "bytes32",
            },
            {
              name: "_sender",
              type: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
        },
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
    ];
  }

  async connect() {
    await this.litNodeClient.disconnect();
    let res = await this.litNodeClient.connect();
    return res;
  }

  async encryptWithViewAccess({
    message,
    file,
  }: {
    message?: string;
    file?: File;
  }) {
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();
    if (!message && !file) {
      throw new Error("Either message or file must be provided");
    }
    if (File) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        evmContractConditions: this.viewAccessControlConditions(),
        file: file,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else if (message) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        evmContractConditions: this.viewAccessControlConditions(),
        string: message,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else {
      throw new Error("Either message or file must be provided");
    }
  }

  async encryptWithMutateAccess({
    message,
    file,
  }: {
    message?: string;
    file?: File;
  }) {
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();
    if (!message && !file) {
      throw new Error("Either message or file must be provided");
    }
    if (File) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        evmContractConditions: this.mutateAccessControlConditions(),
        file: file,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else if (message) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        evmContractConditions: this.mutateAccessControlConditions(),
        string: message,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else {
      throw new Error("Either message or file must be provided");
    }
  }

  async encrypt(message?: string, file?: File) {
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();
    if (!message && !file) {
      throw new Error("Either message or file must be provided");
    }
    if (File) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        // evmContractConditions: this.accessControlConditions(),
        accessControlConditions:
          accessControlConditions as AccessControlConditions,
        file: file,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else if (message) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        // evmContractConditions: this.accessControlConditions(),
        accessControlConditions:
          accessControlConditions as AccessControlConditions,
        string: message,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    }
  }

  async decrypt(
    payload: EncryptToJsonPayload,
    // sessionSigs: SessionSigsMap,
    authSig?: AuthSig
  ) {
    await this.litNodeClient.disconnect();
    let res = await this.litNodeClient.connect();
    const sessionSignatures = await this.getSessionSignatures();
    // Get the session signatures
    // Decrypt the message
    try {
      const decryptedString = await LitJsSdk.decryptFromJson({
        parsedJsonData: payload,
        sessionSigs: sessionSignatures,
        litNodeClient: this.litNodeClient,
      });

      // Return the decrypted string
      return { decryptedString } as {
        decryptedString: string | File | Blob;
      };
    } catch (e) {
      console.error(e);
    }
  }

  async getSessionSignaturesByDelegation() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    const res = await fetch("/api/lit", {
      method: "POST",
      body: JSON.stringify({ delegateToAddress: walletAddress }),
    });
    const sessionSigs = await res.json();
    console.log(sessionSigs);
    return sessionSigs;
  }
  async getSessionSignatures() {
    // authSig: AuthSig
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const ethersSigner = provider.getSigner();
    const walletAddress = await ethersSigner.getAddress();
    const sessionSignatures = await this.litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      // capabilityAuthSigs: [authSig], // Unnecessary on datil-dev
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LitAbility.AccessControlConditionDecryption,
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
          walletAddress,
          nonce: await this.litNodeClient.getLatestBlockhash(),
          litNodeClient: this.litNodeClient,
        });

        return await generateAuthSig({
          signer: ethersSigner,
          toSign,
        });
      },
    });
    return sessionSignatures;
  }
}
