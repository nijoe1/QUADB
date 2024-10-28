import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createIPNSNameWithCID } from "@/lib/ipfs"; // Assume these functions exist
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts"; // Assume these constants exist
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Address, TransactionReceipt } from "viem";
import { useToast } from "@/hooks/useToast";
import { useUploadFile } from "@/hooks/lighthouse/useUpload";

export interface FormData {
  name: string;
  about: string;
  image: string;
  members?: `0x${string}`[];
  file: string;
}

interface UseCreateInstanceProps {
  onClose: () => void;
  spaceID: `0x${string}`;
}

export const useCreateInstance = ({
  onClose,
  spaceID,
}: UseCreateInstanceProps) => {
  console.log("spaceID", spaceID);
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const toast = useToast();

  const { mutateAsync: uploadFile } = useUploadFile();

  const [isLoading, setIsLoading] = useState(false);
  const uploadMetadata = async (formData: FormData) => {
    const metadata = {
      name: formData.name,
      about: formData.about,
      imageUrl: formData.image,
    };
    const metadataFile = new File([JSON.stringify(metadata)], "metadata.json", {
      type: "application/json",
    });
    return await uploadFile({ files: [metadataFile] });
  };
  const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], "file", { type });
  };
  const mutation = useMutation<TransactionReceipt, Error, FormData>({
    mutationFn: async (formData) => {
      if (!walletClient || !publicClient || !account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      try {
        const metadataCID = await uploadMetadata(formData);
        const fileCID = await uploadFile({
          files: [base64ToBlob(formData.file, "text/csv")],
        });

        const ipnsResult = await createIPNSNameWithCID({
          cid: fileCID ?? "",
          spaceID,
          address: account,
          walletClient,
        });
        // Simulate contract call
        const simulation = await publicClient.simulateContract({
          account,
          address: CONTRACT_ADDRESSES as Address,
          abi: CONTRACT_ABI,
          functionName: "createSpaceInstance",
          args: [
            spaceID,
            BigInt(0),
            formData.members || [],
            metadataCID || "",
            "chatID",
            ipnsResult.name,
            ipnsResult.cid,
          ],
        });

        // Send transaction
        const hash = await walletClient.writeContract(simulation.request);
        return await publicClient.waitForTransactionReceipt({ hash });
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Dataset Created",
        message: "Your dataset has been created successfully.",
        type: "success",
        duration: 5000,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        message: `An error occurred: ${error.message}`,
        type: "error",
        duration: 5000,
      });
    },
  });

  return { mutation, isLoading };
};
