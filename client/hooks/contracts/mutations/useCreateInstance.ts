import { useMutation } from "@tanstack/react-query";
import { Abi, Address, isAddress } from "viem";

import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { useProgressModal } from "@/components/ProgressModal";
import { useCreateInstanceIPNS } from "@/hooks/ipns/create/useCreateInstance";
import { useUploadFile } from "@/hooks/storacha";
import { showToast } from "@/lib/toast";

import { TransactionState, useContractTransaction } from "../utlis";

export interface FormData {
  name: string;
  about: string;
  image: File;
  members?: Address[];
  threshold?: number;
  file: File;
}

interface UseCreateInstanceProps {
  spaceID: Address;
}

export const useCreateInstance = ({ spaceID }: UseCreateInstanceProps) => {
  const createIPNS = useCreateInstanceIPNS();

  const { executeContractTransaction: createInstance } = useContractTransaction();

  const { mutateAsync: uploadFileMutation } = useUploadFile();

  const uploadFile = async (file: File) => {
    const cid = await uploadFileMutation(file, {
      onError: () => {
        throw { title: "Error", description: "An error occurred while uploading the file" };
      },
    });
    return cid;
  };

  const uploadInstanceMetadata = useMutation({
    mutationFn: async (formData: FormData) => {
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
    },
    onError: () => {
      throw { title: "Error", description: "An error occurred while uploading metadata" };
    },
  });

  const uploadInstanceFile = useMutation({
    mutationFn: uploadFileMutation,
    onError: () => {
      throw { title: "Error", description: "An error occurred while uploading the dataset" };
    },
  });

  const steps = [
    {
      name: "Uploading metadata",
      description: "Uploading dataset metadata",
      functionStatus: uploadInstanceMetadata,
    },
    {
      name: "Uploading file",
      description: "Uploading dataset file",
      functionStatus: uploadInstanceFile,
    },
    {
      name: "Creating IPNS",
      description: "Creating dataset IPNS",
      functionStatus: createIPNS,
    },
    {
      name: "Creating dataset",
      description: "Creating dataset on chain",
      functionStatus: createInstance,
    },
  ];

  const { progressModalProps, resetSteps } = useProgressModal({
    steps: steps.map((step) => ({
      functionStatus: step.functionStatus,
      step: {
        name: step.name,
        description: step.description,
      },
    })),
    heading: "Creating dataset...",
    subheading: "Please hold while your dataset is being created.",
  });

  const mutation = useMutation<TransactionState, Error, FormData>({
    mutationFn: async (formData) => {
      try {
        console.log("formData", formData);
        const metadataCID = await uploadInstanceMetadata.mutateAsync(formData);
        const fileCID = (await uploadInstanceFile.mutateAsync(formData.file)) as unknown as string;

        const ipnsResult = await createIPNS.mutateAsync({
          cid: fileCID ?? "",
          spaceID,
          threshold: formData.threshold || 1,
        });

        const members = formData?.members?.filter((member) => isAddress(member)) || [];
        const threshold = formData?.threshold || 1;

        const price = BigInt(0);

        const transactionState = await createInstance.mutateAsync({
          contractAddress: CONTRACT_ADDRESSES as Address,
          abi: CONTRACT_ABI as Abi,
          functionName: "createSpaceInstance",
          args: [
            spaceID,
            price,
            members,
            threshold,
            metadataCID,
            ipnsResult.name,
            ipnsResult.lit_config_cid,
          ],
        });

        return transactionState;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      showToast.success("Dataset Created", "Your dataset has been created successfully.");
      resetSteps();
    },
    onError: (error: any) => {
      showToast.error(error.title, error.description);
      resetSteps();
    },
  });

  return { mutation, progressModalProps };
};
