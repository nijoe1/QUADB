import React, { useState, useEffect } from "react";
import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts";
const Subscribe = ({
  isOpen = { isOpen },
  onClose = { onClose },
  instanceID,
  price,
}) => {
  const toast = useToast();

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
        args: [instanceID],
        value: BigInt(price),
      });
      console.log(data);
      if (!walletClient) {
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
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      console.log(transaction);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#333333" color="white" borderRadius="md">
        <ModalHeader>Subscribe to Dataset</ModalHeader>
        <ModalBody bg={"#333333"}>
          {"Subsription Price: " + formatEther(BigInt(price)) + "FIL"}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="white" mr={3} onClick={handleCreate}>
            Subscribe
          </Button>
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
        {isProcessingTransaction ? (
          <div className="my-3 mx-auto">
            <span className="text-white" style={{ fontSize: "md" }}>
              {getLoadingMessage()}
            </span>
          </div>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default Subscribe;
