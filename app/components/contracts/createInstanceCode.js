import React, { useState, useEffect, useCallback } from "react";
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
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts";
import { useRouter } from "next/router";
import { createIPNSName, uploadFile } from "@/utils/IPFS";
import { FaFileUpload } from "react-icons/fa";

const CreateNewInstanceCode = ({ isOpen, onClose, spaceID }) => {
  const toast = useToast();
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const chainID = publicClient?.getChainId();
  const { data: walletClient } = useWalletClient();

  const [formData, setFormData] = useState({
    name: "",
    about: "",
    members: [],
    chatID: "",
    IPNS: "",
    IPNSEncryptedKey: "",
    file: null, // Initialize file to null
    instanceID: "",
  });
  const router = useRouter();
  const { address } = useAccount();
  const [tags, setTags] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const getLoadingMessage = () => {
    if (isUploading) {
      return "Uploading On IPFS and pointing to IPNS...";
    }
    if (isProcessingTransaction) {
      return "Processing transaction...";
    }
    return "";
  };

  const handleFileChange = (e) => {
    console.log("File Change Event:", e);
    e.stopPropagation();
    e.preventDefault();
    e.persist();
    const file = e.target.files[0];
    console.log("Selected File:", file);
    setFormData((prevFormData) => ({
      ...prevFormData,
      file: file,
    }));
  };

  const createIPNS = async () => {
    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);
    let jwt = localStorage.getItem(`lighthouse-jwt-${address}`);

    const response = await createIPNSName(
      formData.file, // Use formData.file here
      key,
      address,
      jwt,
      spaceID
    );
    return response;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    try {
      console.log(formData);
      setIsUploading(true);
      let res = await createIPNS();
      setIsUploading(false);
      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createInstanceCode",
        args: [
          spaceID,
          formData.name,
          formData.about,
          "chatID",
          res.name,
          res.cid,
        ],
      });

      if (!walletClient) {
        console.log("Wallet client not found");
        return;
      }
      setIsProcessingTransaction(true);
      const hash = await walletClient.writeContract(data.request);

      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });
      setIsProcessingTransaction(false);

      onClose();

      toast({
        title: "Instance code created successfully",
        description: "Your instance code has been created successfully!",
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
        <ModalHeader>Create New Code</ModalHeader>
        <ModalBody>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Enter instance name"
                value={formData.name}
                onChange={handleChange}
                bg="#424242"
                color="white"
                borderRadius="md"
                _focus={{
                  borderColor: "white",
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>About</FormLabel>
              <Input
                name="about"
                placeholder="Enter instance about"
                value={formData.about}
                onChange={handleChange}
                bg="#424242"
                color="white"
                borderRadius="md"
                _focus={{
                  borderColor: "white",
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Code</FormLabel>
              <InputGroup>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  display="none"
                  id="_file-upload"
                  accept="*"
                />
                <InputRightElement>
                  <label htmlFor="_file-upload">
                    <Icon as={FaFileUpload} cursor="pointer" />
                  </label>
                </InputRightElement>
              </InputGroup>
              <Text
                cursor="pointer"
                color="white"
                ml="2"
                onClick={() => document.getElementById("_file-upload").click()}
              >
                Upload Model Code
              </Text>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="white" mr={3} onClick={handleCreate}>
            Create
          </Button>
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
        {isUploading || isProcessingTransaction ? (
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

export default CreateNewInstanceCode;
