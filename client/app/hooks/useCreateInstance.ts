// hooks/useCreateInstance.ts

import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createIPNSName, storachaUpload } from "@/app/lib/IPFS"; // Assume this exists
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts"; // Assume this exists
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Address, TransactionReceipt } from "viem";

// Define types for form data
export interface FormData {
  name: string;
  about: string;
  image: File | null;
  price: number;
  members: `0x${string}`[];
  file: File | null;
}

interface UseCreateInstanceProps {
  onClose: () => void;
  spaceID: `0x${string}`;
}

export const useCreateInstance = ({
  onClose,
  spaceID,
}: UseCreateInstanceProps) => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const toast = useToast();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessingTransaction, setIsProcessingTransaction] =
    useState<boolean>(false);

  // Upload metadata (name, about, image)
  const uploadMetadata = async (formData: FormData, address: Address) => {
    const metadata = {
      name: formData.name,
      about: formData.about,
      imageUrl: formData.image ? URL.createObjectURL(formData.image) : null,
    };
    const jsonBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const jsonFile = new File([jsonBlob], `metadata.json`, {
      type: "application/json",
    });
    const metadataCID = await storachaUpload(jsonFile);
    return metadataCID;
  };

  // Create IPNS for the dataset
  const createIPNS = async (formData: FormData, spaceID: string) => {
    const isEncrypted = formData.price > 0;
    return await createIPNSName({
      file: formData.file as File,
      chain: "ethereum",
      spaceID,
      isEncrypted,
    });
  };

  // Define mutation with correct types
  const mutation = useMutation<TransactionReceipt, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      if (!walletClient || !publicClient) throw new Error("Client not found");

      setIsUploading(true);
      const metadataCID = await uploadMetadata(formData, account as Address);
      const res = await createIPNS(formData, spaceID);

      const data = await publicClient.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createSpaceInstance",
        args: [
          spaceID,
          BigInt(0),
          formData.members,
          metadataCID.Hash,
          "chatID",
          res.name,
          res.cid,
        ],
      });

      setIsProcessingTransaction(true);

      const hash = await walletClient.writeContract(data.request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });

      return transaction;
    },

    onSuccess: () => {
      setIsProcessingTransaction(false);
      toast({
        title: "Dataset created",
        description: "Your dataset has been created successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error: any) => {
      setIsProcessingTransaction(false);
      toast({
        title: "Error",
        description: `Error occurred: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  return { mutation, isUploading, isProcessingTransaction };
};
