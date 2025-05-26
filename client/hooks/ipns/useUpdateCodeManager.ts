import { useAccount, useWalletClient } from "wagmi";
import { useUpdateCode } from "./update/useUpdateCode";
import { useToast } from "../useToast";

interface UseUpdateCodeManagerProps {
  IPNS: string;
}

export const useUpdateCodeManager = ({ IPNS }: UseUpdateCodeManagerProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();

  const updateCode = useUpdateCode();

  const handleUpdateCode = async (file: File) => {
    if (!walletClient || !address || !file) {
      toast({
        title: "Error",
        description: "Please connect your wallet and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCode.mutateAsync({
        walletClient,
        address,
        file,
        IPNS,
      });
    } catch (error) {
      console.error("Error updating code:", error);
      // Error handling is already done in the useUpdateCode hook
    }
  };

  return {
    // State
    isUpdating: updateCode.isPending,
    error: updateCode.error,

    // Actions
    handleUpdateCode,

    // Validation
    canUpdate: !!walletClient && !!address,
  };
};
