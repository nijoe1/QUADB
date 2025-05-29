import { config } from "dotenv";
import { Address, Hex, WalletClient } from "viem";
import * as Name from "w3name";

import { storachaUploadFile } from "@/hooks/storacha";

config();

export const resolveIPNSName = async (IPNS: string) => {
  const name = Name.parse(IPNS);
  const revision = await Name.resolve(name);
  return revision.value;
};

export const createIPNS = async ({
  cid,
  spaceID,
  threshold,
}: {
  cid: string;
  spaceID: Hex;
  address: Address;
  walletClient: WalletClient;
  threshold: number;
}) => {
  const response = await fetch("/api/lit/create-ipns-action/instance", {
    method: "POST",
    body: JSON.stringify({
      ipfsCID: cid,
      spaceID,
      threshold,
    }),
  });
  const data = (await response.json()) as {
    instanceID: string;
    ipns: string;
    ciphertext: string;
    dataToEncryptHash: string;
    codeCID: string;
  };
  const file = new File([JSON.stringify(data)], "file.json", {
    type: "application/json",
  });
  const lit_config_cid = await storachaUploadFile(file);

  return {
    instanceID: data.instanceID,
    name: data.ipns,
    lit_config_cid: lit_config_cid,
  };
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

interface FileMetadata {
  name: string;
  path: string;
  type: string;
  size: number;
  lastModified: string;
  uploadedAt: string;
  pieceMetadata: {
    version: number;
    roots: string[];
    size: number;
    cid: string;
    piece: string;
  };
  dataCID: string;
}

export const getFileMetadata = async (cid: string) => {
  const metadataRes = await fetch(getIpfsGatewayUri(cid, "metadata.json"));
  const metadata = (await metadataRes.json()) as FileMetadata;
  return metadata;
};

export const fetchIPFSFile = async (cid: string, asJson = true, path?: string) => {
  if (path) {
    const res = await fetch(getIpfsGatewayUri(cid, path));
    const data = asJson ? await res.json() : await res.text();
    return data;
  }
  const metadata = await getFileMetadata(cid);
  const res = await fetch(getIpfsGatewayUri(metadata.dataCID, path));
  const data = asJson ? await res.json() : await res.text();
  return data;
};

export const fetchAndParseCSV = async (cid: string) => {
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

  return customCsvParser(data);
};

export const getIpfsGatewayUri = (cid: string, path?: string) => {
  const _cid = getCorrectIpfsGatewayUri(cid);

  const WEB3_STORAGE_IPFS_GATEWAY = "https://w3s.link/ipfs/{cid}/{path}";

  return WEB3_STORAGE_IPFS_GATEWAY.replace("{cid}", _cid).replace("{path}", path ?? "");
};

export const getIpfsCID = (ipfsCIDLink: string) => {
  const WEB3_STORAGE_IPFS_GATEWAY = "https://w3s.link/ipfs/";
  return ipfsCIDLink.replace(WEB3_STORAGE_IPFS_GATEWAY, "");
};

const getCorrectIpfsGatewayUri = (cid: string) => {
  if (cid.includes("/ipfs/")) {
    console.log("🚀 cid", cid);
    return cid.replace("/ipfs/", "");
  }
  return cid;
};
