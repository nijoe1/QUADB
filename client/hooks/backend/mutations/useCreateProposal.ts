import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";

import { showToast } from "@/lib/toast";

interface CreateProposalParams {
  cid: string;
  proposalDescription: string;
  signature: string;
}

export const useCreateProposal = (instanceId: string, sequence: string) => {
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async ({ cid, proposalDescription, signature }: CreateProposalParams) => {
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
      showToast.success("Proposal created", "Your proposal has been created successfully.");
      queryClient.invalidateQueries({
        queryKey: ["proposals", instanceId, sequence],
      });
    },
    onError: (error) => {
      showToast.error(
        "Error creating proposal",
        error instanceof Error ? error.message : "Unknown error",
      );
    },
  });
};
