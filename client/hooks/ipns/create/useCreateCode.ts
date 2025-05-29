import { useMutation } from "@tanstack/react-query";

import { useUploadFile } from "@/hooks/storacha";

export interface CreateCodeIPNSProps {
  ipfsCID: string;
  instanceID: string;
}

export interface CreateCodeIPNSResponse {
  codeID: string;
  ipns: string;
  lit_config_cid: string;
}

export const useCreateCodeIPNS = () => {
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
    mutationFn: async ({
      ipfsCID,
      instanceID,
    }: CreateCodeIPNSProps): Promise<CreateCodeIPNSResponse> => {
      try {
        const response = await fetch("/api/lit/create-ipns-action/code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ipfsCID,
            instanceID,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          codeID: string;
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
          codeID: data.codeID,
          ipns: data.ipns,
          lit_config_cid: lit_config_cid,
        };
      } catch (error) {
        console.error("Error creating code IPNS:", error);
        throw error;
      }
    },
  });
};
