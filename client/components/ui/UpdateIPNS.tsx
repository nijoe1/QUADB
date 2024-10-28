import React, { useEffect } from "react";
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
  Stack,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { FaFileUpload } from "react-icons/fa";
import { ObjectMatcher } from "@/lib/merge";
import { useUpdateIPNS } from "@/hooks/lighthouse/useIPNS";
import { useCSVHandler } from "@/hooks/useCSVHandler";

const UpdateIPNS = ({
  isOpen,
  onClose,
  isDataset,
  IPNS,
  EncryptedKeyCID,
  currentCSV,
  isEncrypted,
  spaceID,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDataset: boolean;
  IPNS: string;
  EncryptedKeyCID: string;
  currentCSV: string;
  isEncrypted: boolean;
  spaceID: string;
}) => {
  const { address } = useAccount();
  const {
    file,
    newRows,
    setNewRows,
    handleUploadCSV,
    downloadCsv,
    csvToObjectArray,
  } = useCSVHandler();
  const { mutate: handleSubmit } = useUpdateIPNS(
    address,
    IPNS,
    EncryptedKeyCID,
    isEncrypted,
    spaceID
  );

  useEffect(() => {}, [file]);

  const handleMergeArrays = () => {
    const matcher = new ObjectMatcher(csvToObjectArray(currentCSV)[0]);
    const merged = matcher.mergeMatching(
      newRows,
      csvToObjectArray(currentCSV)
    ) as any;
    setNewRows(merged);
    downloadCsv(merged, "merged.csv");
    console.log("Merged Array:", merged);
  };

  return (
    <div className="mt-[5%]">
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bgGradient="linear(to-br, #333333, #222222)"
          color="white"
        >
          <ModalHeader>{`Update ${isDataset ? "dataset" : "code"}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
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
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => handleSubmit({ file: file ?? new File([], "") })}
              colorScheme="black"
              ml="1"
              className="bg-black/80 text-white"
              mr={3}
            >
              Update
            </Button>
            {isDataset && (
              <Button
                onClick={handleMergeArrays}
                colorScheme="black"
                ml="1"
                className="bg-black/80 text-white"
                mr={3}
              >
                Merge & Update
              </Button>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateIPNS;
