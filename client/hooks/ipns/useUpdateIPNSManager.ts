import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import * as W3Name from "w3name";
import { useIPNSSequences } from "./query";
import { useProposalsQuery, Proposal } from "../backend/queries";
import { useCreateProposalWithFile, useSignProposal } from "./mutations";
import { useUpdateInstance } from "./update/useUpdateInstance";
import { useToast } from "../useToast";

interface UseUpdateIPNSManagerProps {
  IPNS: string;
  spaceID: string;
  threshold: number;
  EncryptedKeyCID: string;
}

export const useUpdateIPNSManager = ({
  IPNS,
  spaceID,
  threshold,
  EncryptedKeyCID,
}: UseUpdateIPNSManagerProps) => {
  const { address } = useAccount();
  const { toast } = useToast();

  const [selectedSequence, setSelectedSequence] = useState<string>("");
  const [isUpdatingIPNS, setIsUpdatingIPNS] = useState(false);

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

  // Mutations
  const createProposalWithFile = useCreateProposalWithFile();
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
    // check if the proposal is executed by checking the sequence
    return Number(proposal.sequence) < Number(sequenceData?.currentSequence);
  };

  const hasReachedQuorum = (proposal: any) => {
    return proposal.signatures.length >= threshold;
  };

  const handleCreateProposal = async (
    file: File,
    proposalDescription: string
  ) => {
    if (!sequenceData?.currentSequence) {
      throw new Error("Sequence not available");
    }

    return createProposalWithFile.mutateAsync({
      file,
      proposalDescription,
      IPNS,
      sequence: sequenceData.currentSequence,
      instanceId: spaceID,
    });
  };

  const handleSignProposal = async (cid: string) => {
    if (!sequenceData?.currentSequence) {
      throw new Error("Sequence not available");
    }

    return signProposal.mutateAsync({
      cid,
      IPNS,
      sequence: sequenceData.currentSequence,
      instanceId: spaceID,
    });
  };

  const handleUpdateIPNS = async (proposal: Proposal) => {
    try {
      setIsUpdatingIPNS(true);

      const res = await updateInstance.mutateAsync({
        proposal,
        ipns_metadata: EncryptedKeyCID,
      });
      console.log(res);
      if (!res || !res.success) {
        throw new Error("Failed to update IPNS");
      }

      // Refresh sequence after successful update
      const name = W3Name.parse(IPNS);
      const revision = await W3Name.resolve(name);
      const newSequence = revision.sequence.toString();
      setSelectedSequence(newSequence);

      toast({
        title: "IPNS updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating IPNS:", error);
      toast({
        title: "Error updating IPNS",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingIPNS(false);
    }
  };

  return {
    // Data
    currentSequence: sequenceData?.currentSequence,
    historicalSequences: sequenceData?.historicalSequences || [],
    selectedSequence,
    proposals: proposals || [],

    // Loading states
    isLoadingSequences,
    isLoadingProposals,
    isCreatingProposal: createProposalWithFile.isPending,
    isSigningProposal: signProposal.isPending,
    isUpdatingIPNS,
    refetchProposals,

    // Errors
    sequenceError,
    proposalsError,

    // Actions
    setSelectedSequence,
    handleCreateProposal,
    handleSignProposal,
    handleUpdateIPNS,

    // Helper functions
    hasSigned,
    hasReachedQuorum,
    isProposalExecuted,
  };
};
