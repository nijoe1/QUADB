import { useMutation } from "@tanstack/react-query";
import { Address, Hex, PublicClient, WalletClient } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { usePublicClient } from "wagmi";

import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { showToast } from "@/lib/toast";

export interface CreateSpaceArgs {
  isRoot: boolean;
  newNodeName: string;
  clickedID: Hex;
}

export const useCreateSpace = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address: account } = useAccount();
  return useMutation({
    mutationFn: async (args: CreateSpaceArgs) => {
      if (!walletClient || !publicClient || !account) {
        throw new Error("Connect your wallet to create a subspace");
      }
      return await createNewSubSpace({
        isRoot: args.isRoot,
        newNodeName: args.newNodeName,
        clickedID: args.clickedID,
        walletClient,
        publicClient,
        account,
      });
    },
    onSuccess: () => {
      showToast.success("Subspace Created", "Subspace created successfully");
    },
    onError: () => {
      showToast.error("Error", "Failed to create subspace");
    },
  });
};

const createNewSubSpace = async ({
  isRoot,
  walletClient,
  publicClient,
  account,
  newNodeName,
  clickedID,
}: {
  isRoot: boolean;
  walletClient: WalletClient;
  publicClient: PublicClient;
  account: Address;
  newNodeName: string;
  clickedID: Hex;
}) => {
  if (!walletClient || !publicClient) {
    throw new Error("Wallet client not found");
  }

  if (isRoot) {
    try {
      const data = await publicClient.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createDBSpace",
        args: [newNodeName],
      });
      const hash = await walletClient.writeContract(data.request);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      showToast.success("Subspace Created", "Subspace created successfully");
      console.log(transaction);
    } catch (error) {
      console.log(error);
      showToast.error("Error", "Failed to create subspace");
    }
  } else {
    try {
      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createDBSubSpace",
        args: [clickedID, newNodeName],
      });

      const hash = await walletClient.writeContract(data.request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      showToast.success("Subspace Created", "Subspace created successfully");
      console.log(transaction);
    } catch (error) {
      console.log(error);
      showToast.error("Error", "Failed to create subspace");
    }
  }
};
