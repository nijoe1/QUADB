import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";

import { useToast } from "@/hooks/useToast";

interface SignProposalParams {
  cid: string;
  IPNS: string;
  sequence: string;
  instanceId: string;
}

export const useSignProposal = () => {
  const { toast } = useToast();
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async ({ cid, IPNS, sequence, instanceId }: SignProposalParams) => {
      if (!walletClient || !walletClient.account?.address) {
        throw new Error("Wallet not connected");
      }

      try {
        // Sign the message
        const signature = await walletClient.signMessage({
          message: `I acknowledge updating the current ipns record : ${IPNS} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
        });

        // Add signature via API
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
        console.error("Error signing proposal:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Signature added",
        description: "Your signature has been added successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error signing proposal",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
