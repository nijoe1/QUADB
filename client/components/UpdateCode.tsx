import React, { useEffect, useState } from "react";
import {
  Input,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  InputGroup,
  InputRightElement,
  Icon,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { FaFileUpload } from "react-icons/fa";
import { useWalletClient } from "wagmi";
import * as W3Name from "w3name";
import { useFileUpload } from "@/hooks/storacha";
import { fetchIPFS } from "@/lib/ipfs";
import { useCSVHandler } from "@/hooks/helpers";

const UpdateCode = ({
  isOpen,
  onClose,
  IPNS,
  EncryptedKeyCID,
}: {
  isOpen: boolean;
  onClose: () => void;
  IPNS: string;
  EncryptedKeyCID: string;
}) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const toast = useToast();

  const [isUpdatingIPNS, setIsUpdatingIPNS] = useState(false);

  const uploadFiles = useFileUpload();

  const { file, handleUploadCSV } = useCSVHandler();

  const uploadFile = async (file: File): Promise<string> => {
    if (!walletClient || !address) {
      throw new Error("Wallet client not found");
    }

    return (await uploadFiles(file)) as unknown as string;
  };

  const handleSignUpdateCode = async () => {
    if (!walletClient || !address || !file) {
      toast({
        title: "Error",
        description: "Please connect your wallet and select a file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const cid = await uploadFile(file);

      const name = W3Name.parse(IPNS);
      const revision = await W3Name.resolve(name);
      const sequence = revision.sequence.toString();

      const signature = await walletClient.signMessage({
        message: `I acknowledge updating the current ipns record : ${IPNS} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
      });

      toast({
        title: "Proposal created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return { signature, cid, IPNS, sequence };
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error creating proposal",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  interface updateCodeBody {
    signature: string;
    newCid: string;
    ipns: string;
    ciphertext: string;
    dataToEncryptHash: string;
    codeID: string;
    codeHash: string;
  }

  interface IPNSConfig {
    codeID: string;
    ipns: string;
    ciphertext: string;
    dataToEncryptHash: string;
    codeCID: string;
  }

  const handleUpdateCode = async () => {
    if (!walletClient || !address) return;

    try {
      setIsUpdatingIPNS(true);

      const response = await handleSignUpdateCode();
      console.log("response", response);
      if (!response) throw new Error("Failed to sign update code");

      console.log("response.EncryptedKeyCID", EncryptedKeyCID);

      const ipnsConfig = (await fetchIPFS(EncryptedKeyCID)) as IPNSConfig;

      console.log("ipnsConfig", ipnsConfig);

      const body: updateCodeBody = {
        signature: response.signature,
        newCid: response.cid,
        ipns: ipnsConfig.ipns,
        ciphertext: ipnsConfig.ciphertext,
        dataToEncryptHash: ipnsConfig.dataToEncryptHash,
        codeID: ipnsConfig.codeID,
        codeHash: ipnsConfig.codeCID,
      };
      const res = await fetch("/api/lit/update-ipns-action/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      toast({
        title: "IPNS updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating IPNS:", error);
      toast({
        title: "Error updating IPNS",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdatingIPNS(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
      <ModalOverlay />
      <ModalContent bgGradient="linear(to-br, #333333, #222222)" color="white">
        <ModalHeader>Update Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={0}>
            <TabList>
              <Tab>Update Code</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl>
                    <InputGroup>
                      <Input
                        type="file"
                        onChange={handleUploadCSV}
                        display="none"
                        id="__file-upload"
                        accept="*"
                      />
                      <InputRightElement>
                        <label htmlFor="__file-upload">
                          <Icon as={FaFileUpload} cursor="pointer" />
                        </label>
                      </InputRightElement>
                    </InputGroup>
                    <Text cursor="pointer" color="white" ml="2">
                      Upload Code file
                    </Text>
                  </FormControl>

                  <Button
                    onClick={() => handleUpdateCode()}
                    colorScheme="green"
                    isLoading={isUpdatingIPNS}
                    width="full"
                  >
                    Create Proposal
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateCode;
