import React, { useState } from "react";
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
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
const CreateSubSpaceModal = ({
  isOpen,
  onClose,
  isRoot,
  clickedID,
}: {
  isOpen: any;
  onClose: any;
  isRoot: any;
  clickedID: any;
}) => {
  const toast = useToast();

  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [newNodeName, setNewNodeName] = useState("");
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const getLoadingMessage = () => {
    if (isProcessingTransaction) {
      return "Processing transaction...";
    }
    return "";
  };
  async function handleCreate() {
    console.log("Creating new node with name: ", newNodeName);
    await createNewSubSpace();
    onClose();
  }

  const createNewSubSpace = async () => {
    if (isRoot) {
      setIsProcessingTransaction(true);
      try {
        const data = await publicClient?.simulateContract({
          account,
          address: CONTRACT_ADDRESSES,
          abi: CONTRACT_ABI,
          functionName: "createDBSpace",
          args: [newNodeName],
        });
        if (!walletClient || !publicClient || !data) {
          console.log("Wallet client not found");
          return;
        }
        const hash = await walletClient.writeContract(data.request);
        console.log("Transaction Sent");
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
        setIsProcessingTransaction(false);
        toast({
          title: "Subspace Created",
          description: "Subspace created successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        console.log(transaction);
      } catch (error) {
        console.log(error);
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
        console.log(data);
        if (!walletClient || !publicClient || !data) {
          console.log("Wallet client not found");
          return;
        }
        const hash = await walletClient.writeContract(data.request);
        console.log("Transaction Sent");
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
        toast({
          title: "Subspace Created",
          description: "Subspace created successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        console.log(transaction);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#333333" color="white" borderRadius="md">
        <ModalHeader>Create New subspace</ModalHeader>
        <ModalBody bg={"#333333"}>
          <Input
            placeholder="Enter subnode name"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            _focus={{
              borderColor: "white",
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="white" mr={3} onClick={handleCreate}>
            Create
          </Button>
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
        {isProcessingTransaction ? (
          <div className="mx-auto my-3">
            <span className="text-white" style={{ fontSize: "md" }}>
              {getLoadingMessage()}
            </span>
          </div>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default CreateSubSpaceModal;
