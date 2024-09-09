"use client"
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
  Flex,
  Text,
} from "@chakra-ui/react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts";
import { useRouter } from "next/navigation";
import {
  createIPNSName,
  uploadFile,
  storachaUpload,
} from "@/lib/IPFS";
import ChakraTagInput from "@/components/UI/TagsInput";
import { isAddress } from "viem";
import { FaFileUpload, FaImage } from "react-icons/fa";

const CreateNewInstance = ({
  isOpen = { isOpen },
  onClose = { onClose },
  spaceID,
}) => {
  const toast = useToast();
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const chainID = publicClient?.getChainId();
  const { data: walletClient } = useWalletClient();

  const [formData, setFormData] = useState({
    name: "",
    about: "",
    image: null,
    price: 0,
    members: [],
    metadataName: "", // Added metadataName field
    metadataCID: "",
    chatID: "",
    IPNS: "",
    IPNSEncryptedKey: "",
    file: null,
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
  useEffect(() => {}, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleChange({
      target: {
        name: "file",
        value: file,
      },
    });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    let base64 = await convertFileToBase64(file);
    console.log(base64);
    handleChange({
      target: {
        name: "image",
        value: base64,
      },
    });
  };

  const createIPNS = async () => {
    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);
    let jwt = localStorage.getItem(`lighthouse-jwt-${address}`);
    // cid, apiKey, address, jwt, spaceID
    const response = await createIPNSName(
      formData.file,
      key,
      address,
      jwt,
      spaceID,
      formData.price > 0
    );
    return response;
  };

  const uploadMetadata = async () => {
    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);

    const metadata = {
      name: formData.name,
      about: formData.about,
      imageUrl: formData.image,
    };
    const jsonBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    // Create a File object from the Blob
    const jsonFile = new File([jsonBlob], `type.json`, {
      type: "application/json",
    });
    // const metadataCID = await uploadFile(jsonFile, key);
    const metadataCID = await storachaUpload(jsonFile);
    return metadataCID;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleTagsChange = useCallback(
    (event, tags) => {
      const { value } = event.target;

      // Convert all addresses to lowercase
      const lowercaseTags = tags.map((tag) => {
        // Lowercase each tag
        if (tag !== "" && tag) {
          return tag?.toLowerCase();
        }
        return;
      });

      // Check if the new address is a valid Ethereum address
      if (value && !isAddress(value)) {
        toast({
          title: "Invalid Address",
          description: "Not a valid Ethereum address",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      // Check if the new address is already in the tags array
      const count = lowercaseTags.filter(
        (tag) => tag === value?.toLowerCase()
      ).length;
      if (count > 1) {
        toast({
          title: "Duplicate Address",
          description: "This address is already added",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      // Include only distinct addresses
      const distinctTags = [...new Set([...lowercaseTags])];

      // Update the state with distinct addresses
      setTags(distinctTags);
    },
    [setTags]
  );

  const handleCreate = async () => {
    setIsUploading(true);

    let metadataCID = await uploadMetadata();
    let res = await createIPNS();
    setIsUploading(false);
    try {
      // Create space instance
      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createSpaceInstance",
        args: [
          spaceID,
          BigInt(0),
          tags,
          metadataCID, // Concatenating metadataName and metadataCID
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

      // Wait for transaction receipt
      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });
      setIsProcessingTransaction(false);
      onClose();

      // Display success toast
      toast({
        title: "Your dataset has been created successfully",
        description: "Instance created successfully!",
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
        <ModalHeader>Create New Dataset</ModalHeader>
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
              <FormLabel>Image</FormLabel>
              <InputGroup>
                <Input
                  type="file"
                  onChange={handleImageChange}
                  display="none"
                  id="image-upload"
                />
                <InputRightElement>
                  <label htmlFor="image-upload">
                    <Icon as={FaImage} cursor="pointer" />
                  </label>
                </InputRightElement>
              </InputGroup>
              <Text
                cursor="pointer"
                color="white"
                ml="2"
                onClick={() => document.getElementById("image-upload").click()}
              >
                Upload Image
              </Text>
            </FormControl>
            <FormControl>
              <FormLabel>File</FormLabel>
              <InputGroup>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  display="none"
                  id="file-upload"
                />
                <InputRightElement>
                  <label htmlFor="file-upload">
                    <Icon as={FaFileUpload} cursor="pointer" />
                  </label>
                </InputRightElement>
              </InputGroup>
              <Text
                cursor="pointer"
                color="white"
                ml="2"
                onClick={() => document.getElementById("file-upload").click()}
              >
                Upload Dataset
              </Text>
            </FormControl>
            <FormControl>
              <FormLabel>Members optional</FormLabel>
              <ChakraTagInput
                tags={tags}
                onTagsChange={handleTagsChange}
                wrapProps={{ direction: "column", align: "start" }}
                wrapItemProps={(isInput) =>
                  isInput ? { alignSelf: "stretch" } : null
                }
              />
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
export default CreateNewInstance;
