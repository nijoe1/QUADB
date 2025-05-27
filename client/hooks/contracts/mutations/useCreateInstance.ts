import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";
import { Abi, Address, Hex, isAddress } from "viem";

import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import {
  ProgressModalProps,
  ProgressStatus,
  useSteps,
  UseStepsProps,
} from "@/components/ProgressModal";
import { useCreateInstanceIPNS } from "@/hooks/ipns/create/useCreateInstance";
import { storachaUploadFile } from "@/hooks/storacha";
import { useToast } from "@/hooks/useToast";

import { useContractTransaction } from "../utlis";

const InitialProgressModalProps: ProgressModalProps = {
  isOpen: false,
  heading: "Creating dataset...",
  subheading: "Please hold while your dataset is being created.",
  steps: [
    {
      name: "Uploading metadata",
      description: "Uploading dataset metadata",
      status: ProgressStatus.NOT_STARTED,
    },
    {
      name: "Uploading file",
      description: "Uploading dataset file",
      status: ProgressStatus.NOT_STARTED,
    },
    {
      name: "Creating IPNS",
      description: "Creating dataset IPNS",
      status: ProgressStatus.NOT_STARTED,
    },
    {
      name: "Creating dataset",
      description: "Creating dataset on chain",
      status: ProgressStatus.NOT_STARTED,
    },
  ],
};

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

export const useCreateInstance = ({ onClose, spaceID }: UseCreateInstanceProps) => {
  const { toast } = useToast();
  const createIPNS = useCreateInstanceIPNS();

  const { executeContractTransaction: createInstance } = useContractTransaction();

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
      return (await storachaUploadFile(metadataFile)) as unknown as string;
    },
  });

  const uploadInstanceFile = useMutation({
    mutationFn: storachaUploadFile,
  });

  const stepsConfig = InitialProgressModalProps.steps.reduce((acc, step, index) => {
    acc[index] = {
      mutation:
        index === 0
          ? uploadInstanceMetadata
          : index === 1
            ? uploadInstanceFile
            : index === 2
              ? createIPNS
              : createInstance,
      step,
    };
    return acc;
  }, {} as UseStepsProps);

  const { steps } = useSteps(stepsConfig);

  console.log("steps statuses ", steps);

  const progressModalProps = useMemo(
    () => ({
      ...InitialProgressModalProps,
      steps,
    }),
    [steps],
  );

  const mutation = useMutation<Hex, Error, FormData>({
    mutationFn: async (formData) => {
      try {
        const metadataCID = await uploadInstanceMetadata.mutateAsync(formData);
        const fileCID = (await uploadInstanceFile.mutateAsync(formData.file)) as unknown as string;

        const ipnsResult = await createIPNS.mutateAsync({
          cid: fileCID ?? "",
          spaceID,
          threshold: formData.threshold || 1,
        });

        const hash = await createInstance.mutateAsync({
          contractAddress: CONTRACT_ADDRESSES as Address,
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
        });

        return hash;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Dataset Created",
        description: "Your dataset has been created successfully.",
        duration: 5000,
      });
      uploadInstanceMetadata.reset();
      uploadInstanceFile.reset();
      createIPNS.reset();
      createInstance.reset();
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

  return { mutation, progressModalProps };
};
