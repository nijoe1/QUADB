import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createIPNS, createIPNSNameWithCID } from "@/lib/ipfs"; // Assume these functions exist
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts"; // Assume these constants exist
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Abi, Address, TransactionReceipt, isAddress } from "viem";
import { useToast } from "@/hooks/useToast";
import { useUploadFile } from "@/hooks/lighthouse/useUpload";

export interface FormData {
  name: string;
  about: string;
  image: File;
  members?: `0x${string}`[];
  file: File;
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
  const reader = new FileReader();

  const uploadMetadata = async (formData: FormData) => {
    const imageBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(formData.image);
    });
    const metadata = {
      name: formData.name,
      about: formData.about,
      imageUrl: imageBase64,
    };
    const metadataFile = new File([JSON.stringify(metadata)], "metadata.json", {
      type: "application/json",
    });
    return await uploadFile({ files: [metadataFile] });
  };

  const mutation = useMutation<TransactionReceipt, Error, FormData>({
    mutationFn: async (formData) => {
      if (!walletClient || !publicClient || !account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);

      console.log("formData", formData);
      try {
        const metadataCID = await uploadMetadata(formData);
        const fileCID = await uploadFile({
          files: [formData.file],
        });

        const ipnsResult = await createIPNS({
          cid: fileCID ?? "",
          spaceID,
          address: account,
          walletClient,
        });
        console.log("members", formData.members);
        console.log("ipnsResult", ipnsResult);
        // Simulate contract call
        const simulation = await publicClient.simulateContract({
          account,
          address: CONTRACT_ADDRESSES as Address,
          abi: CONTRACT_ABI as Abi,
          functionName: "createSpaceInstance",
          args: [
            spaceID,
            BigInt(0),
            formData.members?.filter((member) => isAddress(member)) || [],
            metadataCID || "",
            ipnsResult.name,
            ipnsResult.lit_config_cid,
          ],
        });
        console.log("simulation", simulation.request);
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
