import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { useWalletClient } from "wagmi";
import { useUploadFile } from "@/hooks/storacha";

interface CreateProposalWithFileParams {
  file: File;
  proposalDescription: string;
  IPNS: string;
  sequence: string;
  instanceId: string;
}

export const useCreateProposalWithFile = () => {
  const { toast } = useToast();
  const { data: walletClient } = useWalletClient();
  const uploadFile = useUploadFile();

  return useMutation({
    mutationFn: async ({
      file,
      proposalDescription,
      IPNS,
      sequence,
      instanceId,
    }: CreateProposalWithFileParams) => {
      if (!walletClient || !walletClient.account?.address) {
        throw new Error("Wallet client not found");
      }

      try {
        // Upload file to get CID
        const cid = (await uploadFile.mutateAsync(file)) as unknown as string;

        // Sign the message
        const signature = await walletClient.signMessage({
          message: `I acknowledge updating the current ipns record : ${IPNS} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
        });

        // Create proposal via API
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
        title: "Proposal created successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating proposal",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
