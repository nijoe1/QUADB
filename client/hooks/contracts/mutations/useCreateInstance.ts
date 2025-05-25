import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createIPNS } from "@/lib/ipfs";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Abi, Address, TransactionReceipt, isAddress } from "viem";
import { useToast } from "@/hooks/useToast";
import { useFileUpload } from "@/hooks/storacha";
import { useGasEstimation } from "@/hooks/contracts";
export interface FormData {
  name: string;
  about: string;
  image: File;
  members?: `0x${string}`[];
  threshold?: number;
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
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const { estimateGas, formatGasEstimate } = useGasEstimation();

  const uploadFile = useFileUpload();

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
    return (await uploadFile(metadataFile)) as unknown as string;
  };

  const mutation = useMutation<TransactionReceipt, Error, FormData>({
    mutationFn: async (formData) => {
      if (!walletClient || !publicClient || !account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);

      try {
        const metadataCID = await uploadMetadata(formData);
        const fileCID = (await uploadFile(formData.file)) as unknown as string;

        const ipnsResult = await createIPNS({
          cid: fileCID ?? "",
          spaceID,
          address: account,
          walletClient,
          threshold: formData.threshold || 1,
        });

        const contractCallArgs = {
          account,
          address: CONTRACT_ADDRESSES as Address,
          abi: CONTRACT_ABI as Abi,
          functionName: "createSpaceInstance",
          args: [
            spaceID,
            BigInt(0),
            formData.members?.filter((member) => isAddress(member)) || [],
            formData.threshold || 0,
            metadataCID || "",
            ipnsResult.name,
            ipnsResult.lit_config_cid,
          ],
        };

        const estimatedGas = await estimateGas(
          contractCallArgs.address,
          contractCallArgs.abi,
          contractCallArgs.functionName,
          contractCallArgs.args
        );

        console.log("estimatedGas", estimatedGas);

        // Simulate contract call
        const simulation = await publicClient.simulateContract({
          ...contractCallArgs,
          gas: estimatedGas.gasLimit,
          maxFeePerGas: estimatedGas.maxFeePerGas,
          maxPriorityFeePerGas: estimatedGas.maxPriorityFeePerGas,
        });
        console.log("simulation", simulation.request);

        // Send transaction
        const hash = await walletClient.writeContract({
          ...contractCallArgs,
          gas: estimatedGas.gasLimit,
          maxFeePerGas: estimatedGas.maxFeePerGas,
          maxPriorityFeePerGas: estimatedGas.maxPriorityFeePerGas,
        });
        return await publicClient.waitForTransactionReceipt({ hash });
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Dataset Created",
        description: "Your dataset has been created successfully.",
        duration: 5000,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  return { mutation, isLoading };
};
