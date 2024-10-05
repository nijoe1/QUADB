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
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/app/constants/contracts";
import { useRouter } from "next/navigation";
import { createIPNSName } from "@/app/lib/IPFS";
import { FaFileUpload } from "react-icons/fa";

const CreateNewInstanceCode = ({
  isOpen,
  onClose,
  spaceID,
}: {
  isOpen: boolean;
  onClose: () => void;
  spaceID: `0x${string}`;
}) => {
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

  const handleFileChange = (e: any) => {
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
    const response = await createIPNSName({
      file: formData.file ?? (new File([""], "") as File),
      spaceID,
      isEncrypted: false,
      chain: chainID?.toString() ?? "",
    });
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

      if (!walletClient || !publicClient || !data) {
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
      <ModalContent className="bg-[#333333] rounded-md">
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
                className="bg-[#424242] text-white rounded-md focus:border-white"
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
                  id="_file-upload"
                  accept="*"
                />
                <InputRightElement>
                  <label htmlFor="_file-upload">
                    <Icon as={FaFileUpload} cursor="pointer" />
                  </label>
                </InputRightElement>
              </InputGroup>
              <Text>Upload Model Code</Text>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreate}>Create</Button>
          <Button onClick={onClose}>Cancel</Button>
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
