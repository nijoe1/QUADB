import * as Name from "w3name";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { getInstanceID } from "@/lib/ens";
import { Lit } from "@/lib/lit";
import { config } from "dotenv";
import { EncryptToJsonPayload } from "@lit-protocol/types";
import { Bytes, ethers, Wallet } from "ethers";
import { uploadFiles } from "../hooks/lighthouse";
import { getUserAPIKey } from "../hooks/lighthouse/utils";
import { Address, WalletClient } from "viem";
config();

export const resolveIPNSName = async (IPNS: string) => {
  const name = Name.parse(IPNS);
  const revision = await Name.resolve(name);
  console.log("Resolved value:", revision.value);
  return revision.value;
};

export const UploadFileEncrypted = async ({
  file,
  spaceID,
  chain,
  address,
  walletClient,
}: {
  file: File;
  spaceID: string;
  chain: string;
  address: Address;
  walletClient: WalletClient;
}) => {
  const lit = new Lit(chain, spaceID);
  const encryptedPayload = JSON.stringify(
    (
      await lit.encryptWithViewAccess({
        file,
      })
    ).jsonPayload
  );

  const encryptedFile = new File([encryptedPayload], "encryptedFile");
  let cid = await uploadFiles(
    [encryptedFile],
    await getUserAPIKey(address, walletClient)
  );
  return cid;
};

export const encryptIPNSKey = async ({
  IPNSPK,
  chain,
  spaceID,
  address,
  walletClient,
}: {
  IPNSPK: string;
  chain: string;
  spaceID: string;
  address: Address;
  walletClient: WalletClient;
}) => {
  const lit = new Lit(chain, spaceID);
  console.log("IPNSPK: ", IPNSPK);
  const payload = (
    await lit.encryptWithMutateAccess({
      message: IPNSPK,
    })
  ).jsonPayload;
  console.log("payload: ", payload);
  const encryptedPayload = JSON.stringify(payload);

  const encryptedFile = new File([encryptedPayload], "encryptedFile.json");
  let cid = await uploadFiles(
    [encryptedFile],
    await getUserAPIKey(address, walletClient)
  );
  return cid as string;
};

export const createIPNSName = async ({
  file,
  spaceID,
  isEncrypted,
  chain,
  address,
  walletClient,
}: {
  file: File;
  spaceID: string;
  isEncrypted: boolean;
  chain: string;
  address: Address;
  walletClient: WalletClient;
}) => {
  let cid;
  if (isEncrypted) {
    cid = await UploadFileEncrypted({
      file,
      spaceID,
      chain,
      address,
      walletClient,
    });
  } else {
    cid = await uploadFiles([file], await getUserAPIKey(address, walletClient));
  }
  // https://www.npmjs.com/package/w3name
  const name = await Name.create();
  console.log("created new name: ", name.toString());
  const instanceID = getInstanceID(spaceID, name.toString());
  console.log("instanceID: ", instanceID);
  console.log("cid: ", cid);

  const revision = await Name.v0(name, cid);
  console.log("revision: ", revision);
  await Name.publish(revision, name.key);

  const byteString = uint8ArrayToString(name.key.bytes, "base64");
  console.log("byteString: ", byteString);
  const encryptedKeyCid = await encryptIPNSKey({
    IPNSPK: byteString,
    spaceID: instanceID,
    chain,
    address,
    walletClient,
  });

  console.log("encryptedKeyCid: ", encryptedKeyCid);

  return {
    instanceID: instanceID,
    name: name.toString(),
    cid: encryptedKeyCid,
  };
};
export const createIPNSNameWithCID = async ({
  cid,
  spaceID,
  chain,
  address,
  walletClient,
}: {
  cid: string;
  spaceID: string;
  chain: string;
  address: Address;
  walletClient: WalletClient;
}) => {
  // https://www.npmjs.com/package/w3name
  const name = await Name.create();
  console.log("created new name: ", name.toString());
  const instanceID = getInstanceID(spaceID, name.toString());
  console.log("instanceID: ", instanceID);
  console.log("cid: ", cid);

  const revision = await Name.v0(name, cid);
  console.log("revision: ", revision);
  await Name.publish(revision, name.key);

  const byteString = uint8ArrayToString(name.key.bytes, "base64");
  console.log("byteString: ", byteString);
  const encryptedKeyCid = await encryptIPNSKey({
    IPNSPK: byteString,
    spaceID: instanceID,
    chain,
    address,
    walletClient,
  });

  console.log("encryptedKeyCid: ", encryptedKeyCid);

  return {
    instanceID: instanceID,
    name: name.toString(),
    cid: encryptedKeyCid,
  };
};
export const renewIPNSName = async ({
  cid,
  IPNS,
  EncryptedKeyCID,
  chain,
}: {
  cid: string;
  IPNS: string;
  EncryptedKeyCID: string;
  chain: string;
}) => {
  const name = Name.parse(IPNS);

  const lit = new Lit(chain);

  const data = (await fetchIPFS(EncryptedKeyCID)) as EncryptToJsonPayload;

  console.log("data: ", data);

  const jsonBlob = await lit.decrypt(data, undefined);

  if (!jsonBlob) {
    throw new Error("Failed to decrypt");
  }

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob.decryptedString], `type.json`, {
    type: "application/json",
  });

  const key = JSON.parse(await jsonFile.text()).key;
  console.log("KEY", key);

  const revision = await Name.resolve(name);
  console.log("Resolved value:", revision.value);

  let nextRevision = await Name.increment(revision, cid);

  const IPNSKey = uint8ArrayFromString(key, "base64");

  const nameKey = await Name.from(IPNSKey);

  await Name.publish(nextRevision, nameKey.key);
};

interface DataStructure {
  Updates: (newUpdate | oldUpdate)[];
}

interface newUpdate {
  data: string | File | Blob | EncryptToJsonPayload | JSON;
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
  cid,
  IPNS,
  EncryptedKeyCID,
  chain,
}: {
  cid: string;
  IPNS: string;
  EncryptedKeyCID: string;
  chain: string;
}) => {
  const name = Name.parse(IPNS);

  const lit = new Lit(chain);

  const data = (await fetchIPFS(EncryptedKeyCID)) as EncryptToJsonPayload;

  const jsonBlob = await lit.decrypt(data, undefined);

  if (!jsonBlob) {
    throw new Error("Failed to decrypt");
  }

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob.decryptedString], `type.json`, {
    type: "application/json",
  });

  const key = JSON.parse(await jsonFile.text()).key;
  console.log("KEY", key);

  const revision = await Name.resolve(name);
  console.log("Resolved value:", revision.value);

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

export const fetchAndParseCSV = async (cid: string, isEncrypted: boolean) => {
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
    const lit = new Lit("ethereum");
    const decryptedBlob = await lit.decrypt(data, undefined);
    if (!decryptedBlob) {
      throw new Error("Failed to decrypt");
    }
    const decryptedFile = new File(
      [decryptedBlob.decryptedString],
      "decrypted.csv",
      {
        type: "text/csv",
      }
    );
    const decryptedText = await decryptedFile.text();
    return customCsvParser(decryptedText);
  } else {
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
