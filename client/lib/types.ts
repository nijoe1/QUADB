export interface LPACC_EVM_CONTRACT {
  conditionType?: string;
  contractAddress: string;
  chain:
    | "ethereum"
    | "polygon"
    | "fantom"
    | "xdai"
    | "bsc"
    | "arbitrum"
    | "arbitrumSepolia"
    | "avalanche"
    | "fuji"
    | "harmony"
    | "mumbai"
    | "goerli"
    | "cronos"
    | "optimism"
    | "celo"
    | "aurora"
    | "eluvio"
    | "alfajores"
    | "xdc"
    | "evmos"
    | "evmosTestnet"
    | "bscTestnet"
    | "baseGoerli"
    | "baseSepolia"
    | "moonbeam"
    | "moonriver"
    | "moonbaseAlpha"
    | "filecoin"
    | "hyperspace"
    | "sepolia"
    | "scrollAlphaTestnet"
    | "scroll"
    | "zksync"
    | "base"
    | "lukso"
    | "luksoTestnet"
    | "zora"
    | "zoraGoerli"
    | "zksyncTestnet"
    | "lineaGoerli"
    | "chronicleTestnet"
    | "yellowstone"
    | "lit"
    | "chiado"
    | "zkEvm"
    | "mantleTestnet"
    | "mantle"
    | "klaytn"
    | "publicGoodsNetwork"
    | "optimismGoerli"
    | "waevEclipseTestnet"
    | "waevEclipseDevnet"
    | "verifyTestnet"
    | "fuse"
    | "campNetwork"
    | "vanar"
    | "lisk"
    | "chilizMainnet"
    | "chilizTestnet"
    | "skaleTestnet"
    | "skale"
    | "fhenixHelium"
    | "hederaTestnet"
    | "bitTorrentTestnet"
    | "kintoTestnet";
  functionName: string;
  functionParams: string[];
  functionAbi: {
    name: string;
    type?: string;
    stateMutability: string;
    constant?: boolean;
    inputs: {
      name: string;
      type: string;
      internalType?: string;
    }[];
    outputs: {
      name: string;
      type: string;
      internalType?: string;
    }[];
  };
  returnValueTest: {
    key: string;
    comparator: "contains" | "=" | ">" | ">=" | "<" | "<=";
    value: string;
  };
}

export type Result<T> = { type: "success"; value: T } | { type: "error"; error: Error };

export function success<T>(value: T): Result<T> {
  return { type: "success", value };
}

export function error<T>(error: Error): Result<T> {
  return { type: "error", error };
}

export const dateToEthereumTimestamp = (date: Date): bigint =>
  BigInt(Math.floor(date.getTime() / 1000));

export type AnyJson = boolean | number | string | null | undefined | JsonArray | JsonMap;

export interface JsonMap {
  [key: string]: AnyJson;
}
export type JsonArray = AnyJson[];
export type IpfsUploader = (file: Blob | AnyJson) => Promise<Result<string>>;

export interface updateIPNSBody {
  signatures: string[];
  newCid: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  instanceID: string;
  codeHash: string;
}

export interface IPNSConfig {
  instanceID: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  codeCID: string;
}
