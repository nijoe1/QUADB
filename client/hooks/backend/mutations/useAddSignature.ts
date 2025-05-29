import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";

import { showToast } from "@/lib/toast";

interface AddSignatureParams {
  cid: string;
  signature: string;
}

export const useAddSignature = (instanceId: string, sequence: string) => {
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async ({ cid, signature }: AddSignatureParams) => {
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
      showToast.success("Signature added", "Your signature has been added successfully.");
      queryClient.invalidateQueries({
        queryKey: ["proposals", instanceId, sequence],
      });
    },
    onError: (error) => {
      showToast.error(
        "Error adding signature",
        error instanceof Error ? error.message : "Unknown error",
      );
    },
  });
};
