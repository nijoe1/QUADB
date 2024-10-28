import { createIPNSName } from "@/lib/ipfs"; // Assume these functions exist
import { useMutation } from "@tanstack/react-query";
import { uploadFiles } from "@/hooks/lighthouse";
import { getUserAPIKey } from "@/hooks/lighthouse/utils";
import { useAccount, useWalletClient } from "wagmi";

export const useUpload = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const upload = useMutation({
    mutationFn: async (file: File) => {
      if (!walletClient || !address) {
        throw new Error("Wallet client not found");
      }
      return await uploadFiles(
        [file],
        await getUserAPIKey(address, walletClient)
      );
    },
  });

  return upload;
};
