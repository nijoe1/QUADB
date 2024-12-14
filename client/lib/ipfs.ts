import * as Name from "w3name";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { getInstanceID } from "@/lib/ens";
import { config } from "dotenv";
import { Bytes, ethers } from "ethers";
import {
  getMutateConditions,
  getUserAPIKey,
  getUserJWT,
  getViewConditions,
} from "../hooks/lighthouse/utils";
import { Address, Hex, WalletClient } from "viem";
import { decrypt, uploadFiles, uploadFilesEncrypted } from "@/hooks/lighthouse";
import { QUADB } from "@/constants/contracts";
config();

export const resolveIPNSName = async (IPNS: string) => {
  const name = Name.parse(IPNS);
  const revision = await Name.resolve(name);
  return revision.value;
};

export const encryptIPNSKey = async ({
  IPNSPK,
  spaceID,
  address,
  walletClient,
}: {
  IPNSPK: string;
  spaceID: string;
  address: Hex;
  walletClient: WalletClient;
}) => {
  const payload = {
    message: IPNSPK,
  };
  const encryptedPayload = JSON.stringify(payload);

  const mutateAccessControlConditions = getMutateConditions({
    contractAddress: QUADB,
    chainID: 314,
    instanceID: spaceID,
  });

  const encryptedFile = new File([encryptedPayload], "encryptedFile.json");
  let cid = await uploadFilesEncrypted({
    files: [encryptedFile],
    apiKey: await getUserAPIKey(address, walletClient),
    userAddress: address,
    jwt: (await getUserJWT(address, walletClient)) as string,
    conditions: mutateAccessControlConditions.conditions,
    aggregator: mutateAccessControlConditions.aggregator,
  });
  return cid as string;
};

export const createIPNSName = async ({
  file,
  spaceID,
  isEncrypted,
  address,
  walletClient,
}: {
  file: File;
  spaceID: Hex;
  isEncrypted: boolean;
  address: Address;
  walletClient: WalletClient;
}) => {
  let cid: string | null = null;
  if (isEncrypted) {
    const viewAccessControlConditions = getViewConditions({
      contractAddress: QUADB,
      chainID: 314,
      instanceID: spaceID,
    });
    cid = await uploadFilesEncrypted({
      files: [file],
      apiKey: await getUserAPIKey(address, walletClient),
      userAddress: address,
      jwt: (await getUserJWT(address, walletClient)) as string,
      conditions: viewAccessControlConditions.conditions,
      aggregator: viewAccessControlConditions.aggregator,
    });
  } else {
    cid = await uploadFiles([file], await getUserAPIKey(address, walletClient));
  }
  // https://www.npmjs.com/package/w3name
  const name = await Name.create();
  const instanceID = getInstanceID(spaceID, name.toString());
  const revision = await Name.v0(name, cid ?? "");
  await Name.publish(revision, name.key);
  const byteString = uint8ArrayToString(name.key.bytes, "base64");
  const encryptedKeyCid = await encryptIPNSKey({
    IPNSPK: byteString,
    spaceID: instanceID,
    address,
    walletClient,
  });
  return {
    instanceID: instanceID,
    name: name.toString(),
    cid: encryptedKeyCid,
  };
};
export const createIPNSNameWithCID = async ({
  cid,
  spaceID,
  address,
  walletClient,
}: {
  cid: string;
  spaceID: Hex;
  address: Address;
  walletClient: WalletClient;
}) => {
  // https://www.npmjs.com/package/w3name
  const name = await Name.create();
  const instanceID = getInstanceID(spaceID, name.toString().toLowerCase());
  const revision = await Name.v0(name, cid);
  await Name.publish(revision, name.key);
  const byteString = uint8ArrayToString(name.key.bytes, "base64");
  const encryptedKeyCid = await encryptIPNSKey({
    IPNSPK: byteString,
    spaceID: instanceID,
    address,
    walletClient,
  });
  return {
    instanceID: instanceID,
    name: name.toString().toLowerCase(),
    cid: encryptedKeyCid,
  };
};
export const renewIPNSName = async ({
  cid,
  IPNS,
  EncryptedKeyCID,
  address,
  jwt,
}: {
  cid: string;
  IPNS: string;
  EncryptedKeyCID: string;
  address: Address;
  jwt: string;
}) => {
  const name = Name.parse(IPNS);
  const jsonBlob = await decrypt(EncryptedKeyCID, address, jwt);
  console.log("jsonBlob", jsonBlob);
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });
  const key = JSON.parse(await jsonFile.text()).message;
  const revision = await Name.resolve(name);
  let nextRevision = await Name.increment(revision, cid);
  const IPNSKey = uint8ArrayFromString(key, "base64");
  const nameKey = await Name.from(IPNSKey);
  await Name.publish(nextRevision, nameKey.key);
};

interface DataStructure {
  Updates: (newUpdate | oldUpdate)[];
}

interface newUpdate {
  data: string | File | Blob | JSON;
  signatures: string[];
  Timestamp: string;
}

interface oldUpdate {
  oldCID: string;
}

export const updateStructure = async ({
  oldCID,
  newData,
  signatures,
  curators,
  quorum,
  address,
  walletClient,
}: {
  oldCID: string;
  newData: string;
  signatures: string[];
  curators: string[];
  quorum: number;
  address: Address;
  walletClient: WalletClient;
}) => {
  const passesValidation = await validateSignatures({
    data: newData,
    signatures,
    curators,
    quorum,
  });
  if (!passesValidation) {
    throw new Error("Invalid signatures");
  }
  const update: DataStructure = {
    Updates: [
      {
        oldCID,
      },
      {
        data: newData,
        signatures,
        Timestamp: new Date().toISOString(),
      },
    ],
  };
  const updateFile = new File([JSON.stringify(update)], "update.json");
  const updateCID = await uploadFiles(
    [updateFile],
    await getUserAPIKey(address, walletClient)
  );
  return updateCID;
};

export const validateSignatures = async ({
  data,
  signatures,
  curators,
  quorum,
}: {
  data: Bytes | string;
  signatures: string[];
  curators: string[];
  quorum: number;
}) => {
  const validSignatures = signatures.filter((signature) => {
    const signer = ethers.utils.verifyMessage(data, signature);
    return curators.includes(signer);
  });
  return validSignatures.length >= quorum;
};

export const validateRenewIPNSName = async ({
  address,
  cid,
  IPNS,
  EncryptedKeyCID,
  jwt,
}: {
  address: Address;
  cid: string;
  IPNS: string;
  EncryptedKeyCID: string;
  jwt: string;
}) => {
  const name = Name.parse(IPNS);
  const jsonBlob = await decrypt(EncryptedKeyCID, address, jwt);
  if (!jsonBlob) {
    throw new Error("Failed to decrypt");
  }
  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });
  const key = JSON.parse(await jsonFile.text()).message;
  const revision = await Name.resolve(name);
  let nextRevision = await Name.increment(revision, cid);
  const IPNSKey = uint8ArrayFromString(key, "base64");
  const nameKey = await Name.from(IPNSKey);
  await Name.publish(nextRevision, nameKey.key);
};

export const resolveIPNS = async (IPNS: string) => {
  const name = Name.parse(IPNS);
  const revision = await Name.resolve(name);
  return revision.value;
};

export const fetchIPFS = async (cid: string) => {
  const res = await fetch(getIpfsGatewayUri(cid));
  const data = await res.json();
  return data;
};

export const fetchAndParseCSV = async (
  cid: string,
  isEncrypted: boolean,
  address: string,
  jwt: string
) => {
  const customCsvParser = (csvString: any) => {
    const rows = csvString.split("\n").map((row: any) => row.split(","));
    const headers = rows[0];
    const data = rows.slice(1).map((row: any) => {
      const rowData = {} as any;
      headers.forEach((header: any, index: any) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
    return data;
  };
  const data = await fetchIPFS(cid);
  if (isEncrypted) {
    const decryptedFile = await decrypt(cid, address, jwt);
    const decryptedText = await decryptedFile.text();
    return customCsvParser(decryptedText);
  } else {
    const data = await fetchIPFS(cid);

    return customCsvParser(data);
  }
};

export const getIpfsGatewayUri = (cid: string, path?: string) => {
  const LIGHTHOUSE_IPFS_GATEWAY =
    "https://gateway.lighthouse.storage/ipfs/{cid}";
  return LIGHTHOUSE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const getIpfsCID = (ipfsCIDLink: string) => {
  const LIGHTHOUSE_IPFS_GATEWAY = "https://w3s.link/ipfs/";
  return ipfsCIDLink.replace(LIGHTHOUSE_IPFS_GATEWAY, "");
};
