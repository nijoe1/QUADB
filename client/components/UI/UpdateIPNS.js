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
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { FaFileUpload } from "react-icons/fa";
import { renewIPNSName, uploadFile, UploadFileEncrypted } from "@/lib/IPFS";
import { ObjectMatcher } from "@/lib/merge";

const UpdateIPNS = ({
  isOpen,
  onClose,
  isDataset,
  IPNS,
  EncryptedKeyCID,
  currentCSV,
  isEncrypted,
  spaceID,
}) => {
  const { address } = useAccount();
  const toast = useToast();
  const [file, setFile] = useState();
  const [newRows, setNewRows] = useState([]);

  useEffect(() => {}, [file]);

  const handleSubmit = async () => {
    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);
    let jwt = localStorage.getItem(`lighthouse-jwt-${address}`);
    try {
      let cid;
      if (!isEncrypted) {
        cid = (await uploadFile(file, key)).Hash;
      } else {
        cid = await UploadFileEncrypted(file, key, address, jwt, spaceID);
      }
      console.log("CID:", cid);
      await renewIPNSName(cid, IPNS, EncryptedKeyCID, address, jwt);
      toast({
        title: "IPNS updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating IPNS:", error);
      toast({
        title: "Error updating IPNS",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose(); // Close the modal after submission
  };

  const handleMergeArrays = () => {
    const matcher = new ObjectMatcher(csvToObjectArray(currentCSV)[0]);
    const merged = matcher.mergeMatching(newRows, csvToObjectArray(currentCSV));
    setNewRows(merged);
    downloadCsv(merged, "merged.csv");
    console.log("Merged Array:", merged);
  };

  const handleUploadCSV = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvString = e.target.result;
      const arrayFromCsv = csvToObjectArray(csvString);
      // @ts-ignore
      setNewRows(arrayFromCsv);
    };
    reader.readAsText(file);
  };

  const csvToObjectArray = (csvString) => {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
    const objects = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const obj = {};
      values.forEach((value, index) => {
        // @ts-ignore
        obj[headers[index]] = value.trim();
      });
      objects.push(obj);
    }
    return objects;
  };

  function objectToCsv(data) {
    const keys = Object.keys(data[0]);
    const headerRow = keys.map((key) => key).join(",");
    const rows = data.map((obj) => {
      return keys
        .map((key) => {
          const cell =
            obj[key] === null || obj[key] === undefined ? "" : obj[key];
          return typeof cell === "string" && cell.includes(",")
            ? `"${cell}"`
            : cell;
        })
        .join(",");
    });
    return headerRow + "\n" + rows.join("\n");
  }

  function downloadCsv(data, filename) {
    const csvString = objectToCsv(data);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const file = new File([blob], filename, {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("File download not supported on this browser.");
    }
  }

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
                <Text
                  cursor="pointer"
                  color="white"
                  ml="2"
                  onClick={() =>
                    document.getElementById("__file-upload").click()
                  }
                >
                  {`Upload ${isDataset ? "dataset" : "code"} file`}
                </Text>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit}
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
