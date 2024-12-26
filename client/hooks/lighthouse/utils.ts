import { getJWT } from "@lighthouse-web3/kavach";
import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";
import { Hex, WalletClient } from "viem";
import { notification } from "../utils/notification";

export const LighthouseChains = {
  314: {
    name: "Filecoin",
  },
  314159: {
    name: "Filecoin_Testnet",
  },
};

export const getIpfsGatewayUri = (cid: string) => {
  const LIGHTHOUSE_IPFS_GATEWAY =
    "https://gateway.lighthouse.storage/ipfs/{cid}";
  return LIGHTHOUSE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const getIpfsCID = (ipfsCIDLink: string) => {
  const LIGHTHOUSE_IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/";
  return ipfsCIDLink.replace(LIGHTHOUSE_IPFS_GATEWAY, "");
};

export const generateLighthouseJWT = async (
  userAddress: string,
  signEncryption: string
) => {
  const response = await getJWT(userAddress, signEncryption);
  if (response.JWT) {
    console.log("JWT", response.JWT);
    localStorage.setItem(
      `lighthouse-jwt-${userAddress.toLowerCase()}`,
      response.JWT
    );
    return response.JWT;
  }

  if (response.error) {
    return null;
  }
};

export const getLighthouseJWT = (userAddress: string) => {
  let jwt: string | null = null;
  try {
    jwt = localStorage.getItem(`lighthouse-jwt-${userAddress.toLowerCase()}`);
  } catch (e) {}
  return jwt;
};

export const getLighthouseAPIKey = (userAddress: string) => {
  let apiKey: string | null = null;
  try {
    apiKey = localStorage.getItem(
      `lighthouse-api-key-${userAddress.toLowerCase()}`
    );
  } catch (e) {}
  return apiKey;
};

export const getUserAPIKey = async (
  address: Hex,
  walletClient: WalletClient
) => {
  const addressLowerCase = address.toLowerCase();
  let apiKey = getLighthouseAPIKey(address);
  if (!apiKey) {
    try {
      let notificationId = notification.info(
        "Sign in to Lighthouse to upload files"
      );
      const verificationMessage = (
        await axios.get(
          `https://api.lighthouse.storage/api/auth/get_message?publicKey=${addressLowerCase}`
        )
      ).data;
      notification.remove(notificationId);
      notificationId = notification.loading("Signing message...");
      const signedMessage = await walletClient.signMessage({
        account: address,
        message: verificationMessage,
      });
      const response = await lighthouse.getApiKey(
        addressLowerCase,
        signedMessage
      );
      notification.success("Signed in to Lighthouse");
      notification.remove(notificationId);
      apiKey = response.data.apiKey;
      localStorage.setItem(`lighthouse-api-key-${addressLowerCase}`, apiKey);
    } catch (e) {
      notification.error("Error signing in to Lighthouse");
      throw new Error("Error signing in to Lighthouse");
    }
  }
  return apiKey;
};

export const getUserJWT = async (address: Hex, walletClient: WalletClient) => {
  let jwt = getLighthouseJWT(address);
  if (!jwt) {
    const messageToSign = (await lighthouse.getAuthMessage(address)).data
      .message;
    if (!messageToSign) {
      notification.error("Error signing in to Lighthouse");
      throw new Error("Error signing in to Lighthouse");
    }
    const signedMessage = await walletClient.signMessage({
      account: address,
      message: messageToSign,
    });
    jwt = await generateLighthouseJWT(address, signedMessage);
  }
  return jwt;
};

export const getViewConditions = ({
  contractAddress,
  chainID,
  instanceID,
}: {
  contractAddress: string;
  chainID: number;
  instanceID: string;
}) => {
  return {
    conditions: [
      {
        id: 1,
        chain: LighthouseChains[chainID as keyof typeof LighthouseChains]?.name,
        method: "hasViewAccess",
        standardContractType: "Custom",
        contractAddress: `${contractAddress}`,
        returnValueTest: {
          comparator: "==",
          value: "true",
        },
        parameters: [`${instanceID}`, ":userAddress"],
        inputArrayType: ["bytes32", "address"],
        outputType: "bool",
      },
    ],
    aggregator: "([1])",
  };
};

export const getMutateConditions = ({
  contractAddress,
  chainID,
  instanceID,
}: {
  contractAddress: string;
  chainID: number;
  instanceID: string;
}) => {
  return {
    conditions: [
      {
        id: 1,
        chain: LighthouseChains[chainID as keyof typeof LighthouseChains]?.name,
        method: "hasMutateAccess",
        standardContractType: "Custom",
        contractAddress: `${contractAddress}`,
        returnValueTest: {
          comparator: "==",
          value: "true",
        },
        parameters: [`${instanceID}`, ":userAddress"],
        inputArrayType: ["bytes32", "address"],
        outputType: "bool",
      },
    ],
    aggregator: "([1])",
  };
};
