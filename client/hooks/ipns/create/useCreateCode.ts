import { storachaUploadFile } from "@/hooks/storacha/useStorachaUpload";
import { useMutation } from "@tanstack/react-query";

export interface CreateCodeIPNSProps {
  ipfsCID: string;
  instanceID: string;
}

export interface CreateCodeIPNSResponse {
  codeID: string;
  ipns: string;
  lit_config_cid: string;
}

// Function to create IPNS using the createCode API route
const createCodeIPNS = async ({
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
    const lit_config_cid = await storachaUploadFile(file);

    return {
      codeID: data.codeID,
      ipns: data.ipns,
      lit_config_cid: lit_config_cid,
    };
  } catch (error) {
    console.error("Error creating code IPNS:", error);
    throw error;
  }
};

export const useCreateCodeIPNS = () => {
  return useMutation({
    mutationFn: createCodeIPNS,
  });
};
