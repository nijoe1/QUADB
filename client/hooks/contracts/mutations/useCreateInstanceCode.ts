import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { Abi, Address, TransactionReceipt } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { useGasEstimation } from "@/hooks/contracts";
import { useCreateCodeIPNS } from "@/hooks/ipns/create/useCreateCode";
import { useUploadFile } from "@/hooks/storacha";
import { useToast } from "@/hooks/useToast";

export interface CodeFormData {
  name: string;
  about: string;
  file: File;
}

interface UseCreateInstanceCodeProps {
  onClose: () => void;
  instanceID: `0x${string}`;
}

export const useCreateInstanceCode = ({ onClose, instanceID }: UseCreateInstanceCodeProps) => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const { estimateGas } = useGasEstimation();
  const { mutateAsync: createCodeIPNS } = useCreateCodeIPNS();
  const uploadFile = useUploadFile();

  const [isLoading, setIsLoading] = useState(false);

  const uploadCodeToIPFS = async (file: File) => {
    return (await uploadFile.mutateAsync(file)) as unknown as string;
  };

  const mutation = useMutation<TransactionReceipt, Error, CodeFormData>({
    mutationFn: async (formData) => {
      if (!walletClient || !publicClient || !account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);

      try {
        // Upload file to IPFS
        const fileCID = await uploadCodeToIPFS(formData.file);

        const ipnsResult = await createCodeIPNS({
          ipfsCID: fileCID,
          instanceID,
        });

        //  Create a json file with the ipnsResult
        const ipnsMetadataFile = new File([JSON.stringify(ipnsResult)], "ipnsMetadata.json", {
          type: "application/json",
        });

        // Upload the ipnsMetadataFile to IPFS
        const ipnsMetadataCID = (await uploadFile.mutateAsync(
          ipnsMetadataFile,
        )) as unknown as string;

        // Prepare contract call arguments
        const contractCallArgs = {
          account,
          address: CONTRACT_ADDRESSES as Address,
          abi: CONTRACT_ABI as Abi,
          functionName: "createInstanceCode",
          args: [instanceID, formData.name, formData.about, ipnsResult.ipns, ipnsMetadataCID],
        };

        // Estimate gas
        const estimatedGas = await estimateGas(
          contractCallArgs.address,
          contractCallArgs.abi,
          contractCallArgs.functionName,
          contractCallArgs.args,
        );

        // Simulate contract call
        await publicClient.simulateContract({
          ...contractCallArgs,
          gas: estimatedGas.gasLimit,
          maxFeePerGas: estimatedGas.maxFeePerGas,
          maxPriorityFeePerGas: estimatedGas.maxPriorityFeePerGas,
        });

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
        title: "Code Created",
        description: "Your code has been created successfully.",
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
