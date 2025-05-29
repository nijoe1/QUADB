import { useMutation } from "@tanstack/react-query";
import { Address } from "viem";
import * as W3Name from "w3name";
import { useAccount, useWalletClient } from "wagmi";

import { useProgressModal } from "@/components/ProgressModal";
import { useUploadFile } from "@/hooks/storacha/useStoracha";
import { showToast } from "@/lib/toast";

interface UseUpdateCodeManagerProps {
  IPNSConfig: IPNSConfig;
  onClose: () => void;
}

export interface UpdateCodeFormData {
  file: File;
  IPNSConfig: IPNSConfig;
}

interface IPNSConfig {
  codeID: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  codeCID: string;
}

interface updateCodeBody {
  signature: string;
  newCid: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  codeID: string;
  codeHash: string;
}

export const useUpdateCodeManager = ({ IPNSConfig, onClose }: UseUpdateCodeManagerProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { mutateAsync: storachaUploadFile } = useUploadFile();

  // Step 1: Upload file to IPFS
  const uploadFile = useMutation({
    mutationFn: storachaUploadFile,
    onError: () => {
      throw { title: "Error", description: "An error occurred while uploading the file" };
    },
  });

  // Step 2: Sign the update message
  const signUpdate = useMutation({
    mutationFn: async ({ cid, file }: { cid: string; file: File }) => {
      if (!walletClient || !address || !file) {
        throw new Error("Please connect your wallet and select a file");
      }

      try {
        const name = W3Name.parse(IPNSConfig.ipns);
        const revision = await W3Name.resolve(name);
        const sequence = revision.sequence.toString();

        const signature = await walletClient.signMessage({
          account: address as Address,
          message: `I acknowledge updating the current ipns record : ${IPNSConfig.ipns} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
        });

        return { signature, cid, IPNSConfig, sequence };
      } catch (error) {
        console.error("Error signing update:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to sign update");
      }
    },
    onError: () => {
      throw { title: "Error", description: "An error occurred while signing the update" };
    },
  });

  // Step 3: Execute the IPNS update
  const executeUpdate = useMutation({
    mutationFn: async ({
      signature,
      cid,
      ipnsConfig,
    }: {
      signature: string;
      cid: string;
      ipnsConfig: IPNSConfig;
    }) => {
      try {
        const body: updateCodeBody = {
          signature,
          newCid: cid,
          ipns: ipnsConfig.ipns,
          ciphertext: ipnsConfig.ciphertext,
          dataToEncryptHash: ipnsConfig.dataToEncryptHash,
          codeID: ipnsConfig.codeID,
          codeHash: ipnsConfig.codeCID,
        };

        const res = await fetch("/api/lit/update-ipns-action/code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = (await res.json()) as {
          success: boolean;
        };

        if (!data.success) {
          throw new Error("Failed to update IPNS");
        }

        return data;
      } catch (error) {
        console.error("Error updating IPNS:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to update IPNS");
      }
    },
    onError: () => {
      throw { title: "Error", description: "An error occurred while updating the IPNS record" };
    },
  });

  // Progress steps for updating code
  const updateCodeSteps = [
    {
      name: "Uploading file",
      description: "Uploading your code file to IPFS",
      functionStatus: uploadFile,
    },
    {
      name: "Signing update",
      description: "Signing the update transaction",
      functionStatus: signUpdate,
    },
    {
      name: "Updating IPNS",
      description: "Updating the IPNS record with new code",
      functionStatus: executeUpdate,
    },
  ];

  // Setup progress modal
  const { progressModalProps, resetSteps } = useProgressModal({
    steps: updateCodeSteps.map((step) => ({
      functionStatus: step.functionStatus,
      step: {
        name: step.name,
        description: step.description,
      },
    })),
    heading: "Updating code...",
    subheading: "Please hold while your code is being updated.",
  });

  // Main mutation for updating code
  const updateCodeMutation = useMutation({
    mutationFn: async (formData: UpdateCodeFormData) => {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      try {
        // Step 1: Upload file
        const cid = await uploadFile.mutateAsync(formData.file);

        // Step 2: Sign the update
        const signResult = await signUpdate.mutateAsync({ cid, file: formData.file });

        // Step 3: Execute the update
        const result = await executeUpdate.mutateAsync({
          signature: signResult.signature,
          cid: signResult.cid,
          ipnsConfig: formData.IPNSConfig,
        });

        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      showToast.success("Code Updated", "Your code has been updated successfully.");
      resetSteps();
      onClose();
    },
    onError: (error: any) => {
      showToast.error(error.title || "Error", error.description || "An error occurred");
      resetSteps();
    },
  });

  return {
    // Mutations
    updateCodeMutation,

    // Progress modal props
    progressModalProps,

    // Validation
    canUpdate: !!walletClient && !!address,
  };
};
