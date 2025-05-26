import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { useWalletClient } from "wagmi";

interface AddSignatureParams {
  cid: string;
  signature: string;
}

export const useAddSignature = (instanceId: string, sequence: string) => {
  const { toast } = useToast();
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
      toast({
        title: "Signature added",
        description: "Your signature has been added successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({
        queryKey: ["proposals", instanceId, sequence],
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding signature",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
