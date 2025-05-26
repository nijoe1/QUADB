import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui-shadcn/dialog";
import { Button } from "@/primitives/Button";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { useToast } from "@/hooks/useToast";

export const Subscribe = ({
  isOpen,
  onClose,
  instanceID,
  price,
}: {
  isOpen: boolean;
  onClose: () => void;
  instanceID: string;
  price: string;
}) => {
  const { toast } = useToast();

  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

  const getLoadingMessage = () => {
    if (isProcessingTransaction) {
      return "Processing transaction...";
    }
    return "";
  };

  async function handleCreate() {
    await SUBSCRIBE();
    onClose();
  }

  const SUBSCRIBE = async () => {
    setIsProcessingTransaction(true);
    try {
      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "purchaseInstanceSubscription",
        args: [instanceID as `0x${string}`],
        value: BigInt(price),
      });
      console.log(data);
      if (!walletClient || !publicClient || !data) {
        console.log("Wallet client not found");
        return;
      }
      // @ts-ignore
      const hash = await walletClient.writeContract(data.request);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      setIsProcessingTransaction(false);
      toast({
        title: "Subscription Created",
        description: "You Subscribed successfully",
        variant: "default",
      });
      console.log(transaction);
    } catch (error) {
      console.log(error);
      setIsProcessingTransaction(false);
      toast({
        title: "Error",
        description: "Failed to subscribe",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-grey-300 bg-[#333333] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Subscribe to Dataset</DialogTitle>
        </DialogHeader>

        <div className="bg-[#333333] py-4">
          <p className="text-white">
            {"Subscription Price: " + formatEther(BigInt(price)) + "FIL"}
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-end space-x-2">
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={isProcessingTransaction}
            value="Subscribe"
          />
          <Button onClick={onClose} value="Cancel" />
        </DialogFooter>

        {isProcessingTransaction && (
          <div className="mx-auto my-3">
            <span className="text-sm text-white">{getLoadingMessage()}</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
