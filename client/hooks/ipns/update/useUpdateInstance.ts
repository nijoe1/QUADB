import { useMutation } from "@tanstack/react-query";

import { fetchIPFSFile } from "@/lib/ipfs";
import { showToast } from "@/lib/toast";

interface UpdateInstanceBody {
  signatures: string[];
  newCid: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  instanceID: string;
  codeHash: string;
}

interface IPNSConfig {
  instanceID: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  codeCID: string;
}

interface UpdateInstanceParams {
  proposal: {
    cid: string;
    signatures: { signature: string }[];
  };
  ipns_metadata: string;
}

const handleUpdateInstance = async ({ proposal, ipns_metadata }: UpdateInstanceParams) => {
  try {
    const signatures = proposal.signatures.map((sig: any) => sig.signature);

    const ipnsConfig = (await fetchIPFSFile(ipns_metadata, true, "data.json")) as IPNSConfig;

    const body: UpdateInstanceBody = {
      signatures,
      newCid: proposal.cid,
      ipns: ipnsConfig.ipns,
      ciphertext: ipnsConfig.ciphertext,
      dataToEncryptHash: ipnsConfig.dataToEncryptHash,
      instanceID: ipnsConfig.instanceID,
      codeHash: ipnsConfig.codeCID,
    };

    const response = await fetch("/api/lit/update-ipns-action/instance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as {
      success: boolean;
    };

    console.log(data);

    if (!data.success) {
      throw new Error("Failed to update IPNS");
    }

    showToast.success("IPNS updated successfully");

    return data;
  } catch (error) {
    console.error("Error updating IPNS:", error);
    showToast.error(
      "Error updating IPNS",
      error instanceof Error ? error.message : "Unknown error",
    );
    throw error;
  }
};

export const useUpdateInstance = () => {
  return useMutation({
    mutationFn: handleUpdateInstance,
  });
};
