import { useState, useEffect } from "react";

import { useMutation } from "@tanstack/react-query";
import * as W3Name from "w3name";
import { useAccount, useWalletClient } from "wagmi";

import { useProgressModal } from "@/components/ProgressModal";
import { useProposalsQuery, Proposal } from "@/hooks/backend/queries";
import { useSignProposal } from "@/hooks/ipns/mutations/useSignProposal";
import { useIPNSSequences } from "@/hooks/ipns/query";
import { useUpdateInstance } from "@/hooks/ipns/update/useUpdateInstance";
import { useUploadFile } from "@/hooks/storacha";
import { showToast } from "@/lib/toast";

interface UseVersionManagerProps {
  IPNS: string;
  spaceID: string;
  threshold: number;
  EncryptedKeyCID: string;
}

export interface VersionFormData {
  file: File;
  description: string;
}

export const useVersionManager = ({
  IPNS,
  spaceID,
  threshold,
  EncryptedKeyCID,
}: UseVersionManagerProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [selectedSequence, setSelectedSequence] = useState<string>("");

  // Fetch IPNS sequences
  const {
    data: sequenceData,
    isLoading: isLoadingSequences,
    error: sequenceError,
  } = useIPNSSequences(IPNS, spaceID, threshold);

  // Fetch proposals for selected sequence
  const {
    data: proposals,
    isLoading: isLoadingProposals,
    error: proposalsError,
    refetch: refetchProposals,
  } = useProposalsQuery(spaceID, selectedSequence);

  const { mutateAsync: uploadFileMutation } = useUploadFile();

  // Step 1: Upload file to IPFS
  const uploadFile = useMutation({
    mutationFn: uploadFileMutation,
    onError: () => {
      throw { title: "Error", description: "An error occurred while uploading the file" };
    },
  });

  // Step 2: Sign the proposal message
  const signProposalMessage = useMutation({
    mutationFn: async ({
      cid,
      IPNS,
      sequence,
    }: {
      cid: string;
      IPNS: string;
      sequence: string;
    }) => {
      if (!walletClient || !walletClient.account?.address) {
        throw new Error("Wallet client not found");
      }

      const signature = await walletClient.signMessage({
        message: `I acknowledge updating the current ipns record : ${IPNS} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
      });

      return { signature, cid };
    },
    onError: () => {
      throw { title: "Error", description: "An error occurred while signing the proposal" };
    },
  });

  // Step 3: Create proposal via API
  const createProposal = useMutation({
    mutationFn: async ({
      cid,
      signature,
      proposalDescription,
      IPNS,
      sequence,
      instanceId,
    }: {
      cid: string;
      signature: string;
      proposalDescription: string;
      IPNS: string;
      sequence: string;
      instanceId: string;
    }) => {
      if (!walletClient?.account?.address) {
        throw new Error("Wallet not connected");
      }

      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId,
          sequence,
          cid,
          proposalDescription,
          signature,
          address: walletClient.account.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create proposal");
      }

      return data;
    },
    onError: () => {
      throw { title: "Error", description: "An error occurred while creating the proposal" };
    },
  });

  const signProposal = useSignProposal();
  const updateInstance = useUpdateInstance();

  // Set initial sequence when data loads
  useEffect(() => {
    if (sequenceData?.currentSequence && !selectedSequence) {
      setSelectedSequence(sequenceData.currentSequence);
    }
  }, [sequenceData?.currentSequence, selectedSequence]);

  // Helper functions
  const hasSigned = (proposal: any) => {
    return proposal.signatures.some((sig: any) => sig.address === address);
  };

  const isProposalExecuted = (proposal: Proposal) => {
    return Number(proposal.sequence) < Number(sequenceData?.currentSequence);
  };

  const hasReachedQuorum = (proposal: any) => {
    return proposal.signatures.length >= threshold;
  };

  // Progress steps for creating a new version
  const createVersionSteps = [
    {
      name: "Uploading file",
      description: "Uploading your file to IPFS",
      functionStatus: uploadFile,
    },
    {
      name: "Signing proposal",
      description: "Signing the proposal message",
      functionStatus: signProposalMessage,
    },
    {
      name: "Creating proposal",
      description: "Creating version proposal",
      functionStatus: createProposal,
    },
  ];

  // Progress steps for signing a proposal
  const signProposalSteps = [
    {
      name: "Signing proposal",
      description: "Signing the version proposal",
      functionStatus: signProposal,
    },
  ];

  // Progress steps for executing a proposal
  const executeProposalSteps = [
    {
      name: "Executing proposal",
      description: "Updating IPNS with new version",
      functionStatus: updateInstance,
    },
  ];

  // Setup progress modals
  const { progressModalProps: createVersionModalProps, resetSteps: resetCreateSteps } =
    useProgressModal({
      steps: createVersionSteps.map((step) => ({
        functionStatus: step.functionStatus,
        step: {
          name: step.name,
          description: step.description,
        },
      })),
      heading: "Creating new version...",
      subheading: "Please hold while your version is being created.",
    });

  const { progressModalProps: signModalProps, resetSteps: resetSignSteps } = useProgressModal({
    steps: signProposalSteps.map((step) => ({
      functionStatus: step.functionStatus,
      step: {
        name: step.name,
        description: step.description,
      },
    })),
    heading: "Signing proposal...",
    subheading: "Please sign the proposal to approve this version.",
  });

  const { progressModalProps: executeModalProps, resetSteps: resetExecuteSteps } = useProgressModal(
    {
      steps: executeProposalSteps.map((step) => ({
        functionStatus: step.functionStatus,
        step: {
          name: step.name,
          description: step.description,
        },
      })),
      heading: "Executing proposal...",
      subheading: "Updating the dataset with the new version.",
    },
  );

  // Main mutation for creating a new version
  const createVersionMutation = useMutation({
    mutationFn: async (formData: VersionFormData) => {
      if (!sequenceData?.currentSequence) {
        throw new Error("Sequence not available");
      }

      try {
        // Step 1: Upload file
        const cid = await uploadFile.mutateAsync(formData.file);

        // Step 2: Sign the proposal message
        const signResult = await signProposalMessage.mutateAsync({
          cid,
          IPNS,
          sequence: sequenceData.currentSequence,
        });

        // Step 3: Create proposal
        const result = await createProposal.mutateAsync({
          cid: signResult.cid,
          signature: signResult.signature,
          proposalDescription: formData.description,
          IPNS,
          sequence: sequenceData.currentSequence,
          instanceId: spaceID,
        });

        await refetchProposals();
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      showToast.success("Version Created", "Your version proposal has been created successfully.");
      resetCreateSteps();
    },
    onError: (error: any) => {
      showToast.error(error.title || "Error", error.description || "An error occurred");
      resetCreateSteps();
    },
  });

  // Sign proposal mutation
  const signProposalMutation = useMutation({
    mutationFn: async (cid: string) => {
      if (!sequenceData?.currentSequence) {
        throw new Error("Sequence not available");
      }

      const result = await signProposal.mutateAsync({
        cid,
        IPNS,
        sequence: sequenceData.currentSequence,
        instanceId: spaceID,
      });

      await refetchProposals();
      return result;
    },
    onSuccess: () => {
      showToast.success("Proposal Signed", "You have successfully signed the proposal.");
      resetSignSteps();
    },
    onError: (error: any) => {
      showToast.error(error.title || "Error", error.description || "An error occurred");
      resetSignSteps();
    },
  });

  // Execute proposal mutation
  const executeProposalMutation = useMutation({
    mutationFn: async (proposal: Proposal) => {
      const result = await updateInstance.mutateAsync({
        proposal,
        ipns_metadata: EncryptedKeyCID,
      });

      if (!result || !result.success) {
        throw new Error("Failed to update IPNS");
      }

      // Refresh sequence after successful update
      const name = W3Name.parse(IPNS);
      const revision = await W3Name.resolve(name);
      console.log(revision);

      const newSequence = revision.sequence.toString();
      setSelectedSequence(newSequence);

      return result;
    },
    onSuccess: () => {
      showToast.success("Version Executed", "The new version has been successfully applied.");
      resetExecuteSteps();
    },
    onError: (error: any) => {
      showToast.error(error.title || "Error", error.description || "An error occurred");
      resetExecuteSteps();
    },
  });

  return {
    // Data
    currentSequence: sequenceData?.currentSequence,
    historicalSequences: sequenceData?.historicalSequences || [],
    selectedSequence,
    proposals: proposals || [],

    // Loading states
    isLoadingSequences,
    isLoadingProposals,

    // Errors
    sequenceError,
    proposalsError,

    // Actions
    setSelectedSequence,
    refetchProposals,

    // Mutations
    createVersionMutation,
    signProposalMutation,
    executeProposalMutation,

    // Progress modal props
    createVersionModalProps,
    signModalProps,
    executeModalProps,

    // Helper functions
    hasSigned,
    hasReachedQuorum,
    isProposalExecuted,
  };
};
