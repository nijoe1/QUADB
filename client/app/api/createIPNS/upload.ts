export type AnyJson =
  | boolean
  | number
  | string
  | null
  | undefined
  | JsonArray
  | JsonMap;
interface JsonMap {
  [key: string]: AnyJson;
}
type JsonArray = Array<AnyJson>;

export type Result<T> =
  | { type: "success"; value: T }
  | { type: "error"; error: Error };

export function success<T>(value: T): Result<T> {
  return { type: "success", value };
}

export function error<T>(error: Error): Result<T> {
  return { type: "error", error };
}

export interface IpfsUploader {
  (file: Blob | AnyJson): Promise<Result<string>>;
}

const pinataToken = process.env.PINATA_JWT_TOKEN;

export function createPinataIpfsUploader(args: {
  endpoint?: string;
  fetch?: typeof globalThis.fetch;
}): IpfsUploader {
  const {
    fetch = globalThis.fetch,
    endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS",
  } = args;

  return async (file: Blob | AnyJson): Promise<Result<string>> => {
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataToken}`,
      },
      body: {
        pinataMetadata: {
          name: "Gitcoin.co",
          keyvalues: {
            app: "Gitcoin.co",
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      },
    };

    const fd = new FormData();
    let blob: Blob;

    if (file instanceof Blob) {
      blob = file;
    } else {
      blob = new Blob([JSON.stringify(file)], { type: "application/json" });
    }

    fd.append("file", blob);
    fd.append("pinataOptions", JSON.stringify(params.body.pinataOptions));
    fd.append("pinataMetadata", JSON.stringify(params.body.pinataMetadata));

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataToken}`,
      },
      body: fd,
      // Include any other headers or options as needed
    });

    if (!res.ok) {
      return error(
        new Error(`Failed to upload file to IPFS: ${await res.text()}`)
      );
    }

    const json = (await res.json()) as { IpfsHash: string };

    return success(json.IpfsHash);
  };
}
