import { AnyJson, IpfsUploader, Result, success } from "@/app/lib/types";

export function uploadData(file: Blob | AnyJson): Promise<Result<string>> {
  const token = process.env.PINATA_JWT_TOKEN!; // Fetch token from .env
  console.log("token", token);
  return createPinataIpfsUploader({
    token,
    endpoint: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  })(file);
}
function createPinataIpfsUploader(args: {
  token: string;
  endpoint: string;
  fetch?: typeof globalThis.fetch;
}): IpfsUploader {
  const {
    fetch = globalThis.fetch,
    token,
    endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS",
  } = args;

  return async (file: Blob | AnyJson): Promise<Result<string>> => {
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        pinataMetadata: {
          name: "quadb",
          keyvalues: {
            app: "quadb",
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
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload file to IPFS: ${await res.text()}`);
    }

    const json = (await res.json()) as { IpfsHash: string };

    return success(json.IpfsHash);
  };
}
