import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { Abi, Address, TransactionReceipt } from "viem";
import { useToast } from "@/hooks/useToast";
import { useFileUpload } from "@/hooks/storacha";
import { useGasEstimation } from "@/hooks/contracts";

export interface CodeFormData {
  name: string;
  about: string;
  file: File;
}

interface UseCreateInstanceCodeProps {
  onClose: () => void;
  instanceID: `0x${string}`;
}

export const useCreateInstanceCode = ({
  onClose,
  instanceID,
}: UseCreateInstanceCodeProps) => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const { estimateGas } = useGasEstimation();

  const uploadFile = useFileUpload();

  const [isLoading, setIsLoading] = useState(false);

  const uploadCodeToIPFS = async (file: File) => {
    return (await uploadFile(file)) as unknown as string;
  };

  // Function to create IPNS using the createCode API route
  const createCodeIPNS = async (ipfsCID: string) => {
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

      return await response.json();
    } catch (error) {
      console.error("Error creating code IPNS:", error);
      throw error;
    }
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

        // Create IPNS using the new API route
        const ipnsResult = await createCodeIPNS(fileCID ?? "");

        //  Create a json file with the ipnsResult
        const ipnsMetadataFile = new File(
          [JSON.stringify(ipnsResult)],
          "ipnsMetadata.json",
          {
            type: "application/json",
          }
        );

        // Upload the ipnsMetadataFile to IPFS
        const ipnsMetadataCID = (await uploadFile(
          ipnsMetadataFile
        )) as unknown as string;

        // Prepare contract call arguments
        const contractCallArgs = {
          account,
          address: CONTRACT_ADDRESSES as Address,
          abi: CONTRACT_ABI as Abi,
          functionName: "createInstanceCode",
          args: [
            instanceID,
            formData.name,
            formData.about,
            ipnsResult.ipns,
            ipnsMetadataCID,
          ],
        };

        // Estimate gas
        const estimatedGas = await estimateGas(
          contractCallArgs.address,
          contractCallArgs.abi,
          contractCallArgs.functionName,
          contractCallArgs.args
        );

        // Simulate contract call
        const simulation = await publicClient.simulateContract({
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
