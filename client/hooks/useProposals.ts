import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useWalletClient } from "wagmi";

interface Proposal {
  id: string;
  instance_id: string;
  sequence: string;
  cid: string;
  proposal_description: string;
  created_at: string;
  signatures: {
    id: string;
    address: string;
    signature: string;
    created_at: string;
  }[];
}

export const useProposals = (instanceId: string, sequence: string) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();

  // Fetch proposals
  const { data: proposals, isLoading } = useQuery({
    queryKey: ["proposals", instanceId, sequence],
    queryFn: async () => {
      if (!instanceId || !sequence) {
        return [];
      }

      try {
        const response = await fetch(
          `/api/signatures?instanceId=${instanceId}&sequence=${sequence}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch proposals");
        }

        const data = await response.json();
        return data.data as Proposal[];
      } catch (error) {
        console.error("Error fetching proposals:", error);
        throw error;
      }
    },
    enabled: !!instanceId && !!sequence,
  });

  // Create new proposal
  const createProposal = useMutation({
    mutationFn: async ({
      cid,
      proposalDescription,
      signature,
    }: {
      cid: string;
      proposalDescription: string;
      signature: string;
    }) => {
      if (!walletClient?.account.address) {
        throw new Error("Wallet not connected");
      }

      if (!instanceId || !sequence) {
        throw new Error("Missing instanceId or sequence");
      }

      try {
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
      } catch (error) {
        console.error("Error creating proposal:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Proposal created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["proposals", instanceId, sequence],
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating proposal",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Add signature to proposal
  const addSignature = useMutation({
    mutationFn: async ({
      cid,
      signature,
    }: {
      cid: string;
      signature: string;
    }) => {
      if (!walletClient?.account.address) {
        throw new Error("Wallet not connected");
      }

      if (!instanceId || !sequence) {
        throw new Error("Missing instanceId or sequence");
      }

      try {
        const response = await fetch("/api/signatures", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instanceId,
            sequence,
            cid,
            signature,
            address: walletClient.account.address,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to add signature");
        }

        return data;
      } catch (error) {
        console.error("Error adding signature:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Signature added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["proposals", instanceId, sequence],
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding signature",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return {
    proposals,
    isLoading,
    createProposal,
    addSignature,
  };
};
