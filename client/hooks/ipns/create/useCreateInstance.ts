import { useMutation } from "@tanstack/react-query";
import { Hex } from "viem";

import { useUploadFile } from "@/hooks/storacha";

export interface CreateInstanceProps {
  cid: string;
  spaceID: Hex;
  threshold: number;
}

export interface CreateInstanceResponse {
  instanceID: string;
  name: string;
  lit_config_cid: string;
}

export const useCreateInstanceIPNS = () => {
  const { mutateAsync: uploadFileMutation } = useUploadFile();

  const uploadFile = async (file: File) => {
    const cid = await uploadFileMutation(file, {
      onError: () => {
        throw { title: "Error", description: "An error occurred while uploading the file" };
      },
    });
    return cid as unknown as string;
  };

  return useMutation({
    mutationFn: async ({ cid, spaceID, threshold }: CreateInstanceProps) => {
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
      const lit_config_cid = await uploadFile(file);

      return {
        instanceID: data.instanceID,
        name: data.ipns,
        lit_config_cid: lit_config_cid,
      };
    },
    onError: () => {
      throw { title: "Error", description: "An error occurred while creating IPNS" };
    },
  });
};
