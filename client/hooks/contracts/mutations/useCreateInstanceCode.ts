import { useMutation } from "@tanstack/react-query";
import { Abi, Address } from "viem";

import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { useProgressModal } from "@/components/ProgressModal";
import { useCreateCodeIPNS } from "@/hooks/ipns/create/useCreateCode";
import { useUploadFile } from "@/hooks/storacha";
import { showToast } from "@/lib/toast";

import { TransactionState, useContractTransaction } from "../utlis";

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
  const createCodeIPNS = useCreateCodeIPNS();
  const { executeContractTransaction: createCode } = useContractTransaction();

  const { mutateAsync: uploadFileMutation } = useUploadFile();

  const uploadFile = async (file: File) => {
    const cid = await uploadFileMutation(file, {
      onError: () => {
        throw { title: "Error", description: "An error occurred while uploading the file" };
      },
    });
    return cid;
  };

  // Upload code file to IPFS
  const uploadCodeFile = useMutation({
    mutationFn: uploadFile,
    onError: () => {
      throw { title: "Error", description: "An error occurred while uploading the code file" };
    },
  });

  // Upload IPNS metadata to IPFS
  const uploadIPNSMetadata = useMutation({
    mutationFn: uploadFile,
    onError: () => {
      throw { title: "Error", description: "An error occurred while uploading IPNS metadata" };
    },
  });

  // Define progress steps
  const steps = [
    {
      name: "Uploading code file",
      description: "Uploading your code file to IPFS",
      functionStatus: uploadCodeFile,
    },
    {
      name: "Creating IPNS",
      description: "Creating IPNS for your code",
      functionStatus: createCodeIPNS,
    },
    {
      name: "Uploading metadata",
      description: "Uploading IPNS metadata",
      functionStatus: uploadIPNSMetadata,
    },
    {
      name: "Creating code",
      description: "Creating code on blockchain",
      functionStatus: createCode,
    },
  ];

  // Setup progress modal
  const { progressModalProps, resetSteps } = useProgressModal({
    steps: steps.map((step) => ({
      functionStatus: step.functionStatus,
      step: {
        name: step.name,
        description: step.description,
      },
    })),
    heading: "Creating code...",
    subheading: "Please hold while your code is being created.",
  });

  const mutation = useMutation<TransactionState, Error, CodeFormData>({
    mutationFn: async (formData) => {
      try {
        // Step 1: Upload file to IPFS
        const fileCID = (await uploadCodeFile.mutateAsync(formData.file)) as unknown as string;

        // Step 2: Create IPNS for the code
        const ipnsResult = await createCodeIPNS.mutateAsync({
          ipfsCID: fileCID,
          instanceID,
        });

        // Step 3: Create and upload IPNS metadata file
        const ipnsMetadataFile = new File([JSON.stringify(ipnsResult)], "ipnsMetadata.json", {
          type: "application/json",
        });
        const ipnsMetadataCID = (await uploadIPNSMetadata.mutateAsync(
          ipnsMetadataFile,
        )) as unknown as string;

        // Step 4: Create code on blockchain
        const transactionState = await createCode.mutateAsync({
          contractAddress: CONTRACT_ADDRESSES as Address,
          abi: CONTRACT_ABI as Abi,
          functionName: "createInstanceCode",
          args: [instanceID, formData.name, formData.about, ipnsResult.ipns, ipnsMetadataCID],
        });

        return transactionState;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      showToast.success("Code Created", "Your code has been created successfully.");
      resetSteps();
      onClose();
    },
    onError: (error: any) => {
      showToast.error(error.title || "Error", error.description || "An error occurred");
      resetSteps();
    },
  });

  return { mutation, progressModalProps };
};
