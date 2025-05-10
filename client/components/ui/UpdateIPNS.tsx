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
  Box,
  VStack,
  HStack,
  Badge,
  Progress,
  Textarea,
  useToast,
  Select,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { FaFileUpload } from "react-icons/fa";
import { ObjectMatcher } from "@/lib/merge";
import { useUpdateIPNS } from "@/hooks/lighthouse/useIPNS";
import { useCSVHandler } from "@/hooks/useCSVHandler";
import { useProposals } from "@/hooks/useProposals";
import { useWalletClient } from "wagmi";
import * as W3Name from "w3name";
import { uploadFiles, uploadFilesEncrypted } from "@/hooks/lighthouse";
import {
  getIpfsGatewayUri,
  getUserAPIKey,
  getUserJWT,
  getViewConditions,
} from "@/hooks/lighthouse/utils";
import { QUADB } from "@/constants/contracts";
import { fetchIPFS } from "@/lib/ipfs";

const UpdateIPNS = ({
  isOpen,
  onClose,
  isDataset,
  IPNS,
  EncryptedKeyCID,
  currentCSV,
  isEncrypted,
  spaceID,
  threshold,
  currentIPNSValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDataset: boolean;
  IPNS: string;
  EncryptedKeyCID: string;
  currentCSV: string;
  isEncrypted: boolean;
  spaceID: string;
  threshold: number;
  currentIPNSValue: string;
}) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const toast = useToast();
  const [sequence, setSequence] = useState<string>("");
  const [proposalDescription, setProposalDescription] = useState<string>("");
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<string>("");
  const [historicalSequences, setHistoricalSequences] = useState<string[]>([]);
  const [isUpdatingIPNS, setIsUpdatingIPNS] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    file,
    newRows,
    setNewRows,
    handleUploadCSV,
    downloadCsv,
    csvToObjectArray,
  } = useCSVHandler();

  const updateIPNSMutation = useUpdateIPNS(
    address,
    IPNS,
    EncryptedKeyCID,
    isEncrypted,
    spaceID
  );

  const { proposals, isLoading, createProposal, addSignature } = useProposals(
    spaceID,
    selectedSequence || sequence
  );

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const name = await W3Name.parse(IPNS);
        const revision = await W3Name.resolve(name);
        const currentSequence = revision.sequence.toString();
        setSequence(currentSequence);
        setSelectedSequence(currentSequence);

        const response = await fetch(
          `/api/signatures/history?instanceId=${spaceID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sequences = data.data
          .filter((p: any) => p.signatures.length >= threshold)
          .map((p: any) => p.sequence);
        setHistoricalSequences([currentSequence, ...sequences]);
      } catch (error) {
        console.error("Error fetching sequences:", error);
        toast({
          title: "Error fetching sequences",
          description: error instanceof Error ? error.message : "Unknown error",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    if (IPNS) {
      fetchSequences();
    }
  }, [IPNS, spaceID, threshold, toast]);

  const handleMergeArrays = () => {
    const matcher = new ObjectMatcher(csvToObjectArray(currentCSV)[0]);
    const merged = matcher.mergeMatching(
      newRows,
      csvToObjectArray(currentCSV)
    ) as any;
    setNewRows(merged);
    downloadCsv(merged, "merged.csv");
    toast({
      title: "Data merged successfully",
      description:
        "The merged data has been downloaded. You can now upload it to create a proposal.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const uploadFile = async (file: File): Promise<string> => {
    if (!walletClient || !address) {
      throw new Error("Wallet client not found");
    }

    if (!isEncrypted) {
      return (await uploadFiles(
        [file],
        await getUserAPIKey(address, walletClient)
      )) as string;
    } else {
      const viewAccessControlConditions = getViewConditions({
        contractAddress: QUADB,
        chainID: 314,
        instanceID: spaceID,
      });
      const jwt = (await getUserJWT(address, walletClient)) as string;
      const apiKey = await getUserAPIKey(address, walletClient);
      return await uploadFilesEncrypted(
        [file],
        apiKey,
        address,
        jwt,
        viewAccessControlConditions.conditions,
        viewAccessControlConditions.aggregator
      );
    }
  };

  const handleCreateProposal = async () => {
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
      setIsCreatingProposal(true);
      const cid = await uploadFile(file);

      const signature = await walletClient.signMessage({
        message: `I acknowledge updating the current ipns record : ${IPNS} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
      });

      const response = await createProposal.mutateAsync({
        cid,
        proposalDescription,
        signature,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to create proposal");
      }

      toast({
        title: "Proposal created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setActiveTab(0); // Switch to proposals tab
      setProposalDescription(""); // Clear the description
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error creating proposal",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreatingProposal(false);
    }
  };

  const handleSignProposal = async (cid: string) => {
    if (!walletClient || !address) return;

    try {
      const signature = await walletClient.signMessage({
        message: `I acknowledge updating the current ipns record : ${IPNS} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
      });

      await addSignature.mutateAsync({
        cid,
        signature,
      });
    } catch (error) {
      console.error("Error signing proposal:", error);
      toast({
        title: "Error signing proposal",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  interface updateIPNSBody {
    signatures: string[];
    newCid: string;
    ipns: string;
    ciphertext: string;
    dataToEncryptHash: string;
    instanceID: string;
    codeHash: string;
  }

  interface IPNSConfig {
    instanceID: string;
    ipns: string;
    ciphertext: string;
    dataToEncryptHash: string;
    codeCID: string;
  }

  const handleUpdateIPNS = async (proposal: any) => {
    if (!walletClient || !address) return;

    try {
      setIsUpdatingIPNS(true);

      const signatures = proposal.signatures.map((sig: any) => sig.signature);

      const config = await fetch(getIpfsGatewayUri(EncryptedKeyCID));
      const ipnsConfig = (await fetchIPFS(EncryptedKeyCID)) as IPNSConfig;

      console.log("ipnsConfig", ipnsConfig);

      const body: updateIPNSBody = {
        signatures,
        newCid: proposal.cid,
        ipns: ipnsConfig.ipns,
        ciphertext: ipnsConfig.ciphertext,
        dataToEncryptHash: ipnsConfig.dataToEncryptHash,
        instanceID: ipnsConfig.instanceID,
        codeHash: ipnsConfig.codeCID,
      };

      const response = await fetch("/api/updateIPNS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "IPNS updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      const name = await W3Name.parse(IPNS);
      const revision = await W3Name.resolve(name);
      setSequence(revision.sequence.toString());
      setSelectedSequence(revision.sequence.toString());
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

  const hasSigned = (proposal: any) => {
    return proposal.signatures.some((sig: any) => sig.address === address);
  };

  const hasReachedQuorum = (proposal: any) => {
    return proposal.signatures.length >= threshold;
  };

  const renderProposal = (proposal: any) => (
    <Box
      key={proposal.id}
      p={4}
      borderWidth={1}
      borderRadius="md"
      borderColor="gray.600"
    >
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Text fontWeight="bold">CID: {proposal.cid}</Text>
          <Badge colorScheme={hasSigned(proposal) ? "green" : "gray"}>
            {hasSigned(proposal) ? "Signed" : "Not Signed"}
          </Badge>
        </HStack>
        <Text>{proposal.proposal_description}</Text>
        <Box>
          <Text mb={2}>
            Signatures: {proposal.signatures.length}/{threshold}
          </Text>
          <Progress
            value={(proposal.signatures.length / threshold) * 100}
            colorScheme={hasReachedQuorum(proposal) ? "green" : "blue"}
          />
        </Box>
        {!hasSigned(proposal) && selectedSequence === sequence && (
          <Button
            onClick={() => handleSignProposal(proposal.cid)}
            colorScheme="green"
            size="sm"
          >
            Sign Proposal
          </Button>
        )}
        {hasReachedQuorum(proposal) && selectedSequence === sequence && (
          <Button
            onClick={() => handleUpdateIPNS(proposal)}
            colorScheme="blue"
            size="sm"
            isLoading={isUpdatingIPNS}
          >
            Execute Proposal
          </Button>
        )}
      </VStack>
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
      <ModalOverlay />
      <ModalContent bgGradient="linear(to-br, #333333, #222222)" color="white">
        <ModalHeader>Update {isDataset ? "dataset" : "code"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Proposals</Tab>
              <Tab>Create New</Tab>
              {isDataset && <Tab>Merge Data</Tab>}
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text mb={2}>Current IPNS Value</Text>
                    <Text fontSize="sm" color="gray.400">
                      {currentIPNSValue}
                    </Text>
                  </Box>

                  <Select
                    value={selectedSequence}
                    onChange={(e) => setSelectedSequence(e.target.value)}
                    bg="gray.700"
                  >
                    {historicalSequences.map((seq) => (
                      <option key={seq} value={seq}>
                        Sequence {seq}
                      </option>
                    ))}
                  </Select>

                  <Divider />

                  {isLoading ? (
                    <Text>Loading proposals...</Text>
                  ) : proposals?.length === 0 ? (
                    <Text>No proposals found</Text>
                  ) : (
                    <VStack spacing={4}>
                      {proposals?.map(renderProposal)}
                    </VStack>
                  )}
                </VStack>
              </TabPanel>

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
                      {`Upload ${isDataset ? "dataset" : "code"} file`}
                    </Text>
                  </FormControl>

                  <FormControl>
                    <Textarea
                      placeholder="Proposal description"
                      value={proposalDescription}
                      onChange={(e) => setProposalDescription(e.target.value)}
                      bg="gray.700"
                    />
                  </FormControl>

                  <Button
                    onClick={handleCreateProposal}
                    colorScheme="green"
                    isLoading={isCreatingProposal}
                    width="full"
                  >
                    Create Proposal
                  </Button>
                </VStack>
              </TabPanel>

              {isDataset && (
                <TabPanel>
                  <VStack spacing={4}>
                    <Box>
                      <Text mb={2}>Current Data</Text>
                      <Text fontSize="sm" color="gray.400">
                        {currentCSV ? "Current data loaded" : "No current data"}
                      </Text>
                    </Box>

                    <FormControl>
                      <InputGroup>
                        <Input
                          type="file"
                          onChange={handleUploadCSV}
                          display="none"
                          id="__merge-file-upload"
                          accept="*"
                        />
                        <InputRightElement>
                          <label htmlFor="__merge-file-upload">
                            <Icon as={FaFileUpload} cursor="pointer" />
                          </label>
                        </InputRightElement>
                      </InputGroup>
                      <Text cursor="pointer" color="white" ml="2">
                        Upload new data to merge
                      </Text>
                    </FormControl>

                    <Button
                      onClick={handleMergeArrays}
                      colorScheme="blue"
                      width="full"
                      isDisabled={!currentCSV || !file}
                    >
                      Merge & Download
                    </Button>

                    <Text fontSize="sm" color="gray.400">
                      After merging and downloading, you can upload the merged
                      file in the Create New tab to create a proposal.
                    </Text>
                  </VStack>
                </TabPanel>
              )}
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

export default UpdateIPNS;
