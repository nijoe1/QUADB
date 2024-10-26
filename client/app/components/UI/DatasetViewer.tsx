import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Center,
  useToast,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { MdMoreVert } from "react-icons/md";
import Loading from "@/app/components/animation/loading";
import { Container } from "@/app/components/ui/container";
import UpdateIPNS from "@/app/components/ui/UpdateIPNS";
import { Lit } from "@/app/lib/lit";
import * as IPFS from "@/app/lib/ipfs";
import { useAccount } from "wagmi";

const DatasetViewer = ({
  cid,
  IPNS,
  EncryptedKeyCID,
  isEncrypted,
  spaceID,
  hasAccess,
}: {
  cid: string;
  IPNS: string;
  EncryptedKeyCID: string;
  isEncrypted: boolean;
  spaceID: string;
  hasAccess: boolean;
}) => {
  const toast = useToast();
  const [csvData, setCsvData] = useState([]);
  const [csvText, setCsvText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetched, setFetched] = useState(false);
  const { address } = useAccount();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const handleUpdateClick = async () => {
    onUpdateOpen();
  };

  useEffect(() => {
    if (cid) {
      fetchCsvData();
    }
  }, [cid]);

  const fetchCsvData = async () => {
    try {
      const response = (await IPFS.fetchIPFS(cid)) as any;
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to fetch CSV file");
      }
      if (!isEncrypted) {
        const base64CSV = await response.text();
        const bytes = atob(base64CSV);
        const byteArray = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          byteArray[i] = bytes.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: "text/csv" });
        console.log("Blob:", blob);
        const file = new File([blob], "data.csv", { type: "text/csv" });

        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          console.log("Text:", text);
          setCsvText(text);
          const parsedData = customCsvParser(text);
          if (parsedData) {
            setCsvData(parsedData);
            setFetched(true);
          } else {
            throw new Error("Failed to parse CSV file");
          }
        };

        reader.readAsText(file);
      } else {
        let blobResponse;
        try {
          const lit = new Lit("sepolia");
          blobResponse = (await lit.decrypt(response))?.decryptedString;
          // Convert the decrypted blob into a File object
          const decryptedFile = new File(
            [blobResponse ?? ""],
            "decrypted.csv",
            {
              type: "text/csv",
            }
          );

          // Read the content of the decrypted File object
          const decryptedText = await decryptedFile.text();

          // Now you can parse the decrypted CSV data
          const parsedData = customCsvParser(decryptedText);
          console.log("Parsed Data:", parsedData);

          if (parsedData) {
            setCsvData(parsedData);
            setFetched(true);
          } else {
            throw new Error("Failed to parse decrypted CSV file");
          }
        } catch (error) {
          throw new Error("Failed to decrypt CSV file: " + error);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const customCsvParser = (csvString: any) => {
    const rows = csvString.split("\n").map((row: any) => row.split(","));
    const headers = rows[0];
    const data = rows.slice(1).map((row: any) => {
      const rowData = {} as any;
      headers.forEach((header: any, index: any) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
    return data;
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  let currentRows = csvData.slice(indexOfFirstRow, indexOfLastRow);

  // Sorting
  const sortedData = [...csvData];

  const handleDownload = () => {
    // Convert CSV data to a string
    const csvString = csvData
      .map((row) => Object.values(row).join(","))
      .join("\n");

    // Create a Blob object from the CSV string
    const blob = new Blob([csvString], { type: "text/csv" });

    // Create a temporary URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();

    // Cleanup by revoking the URL
    URL.revokeObjectURL(url);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      {!fetched ? (
        <div className="flex flex-col items-center mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <>
          <Center>
            <Container>
              {hasAccess && (
                <div className="flex flex-wrap items-center">
                  <Menu colorScheme="black">
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<Icon as={MdMoreVert} />}
                      colorScheme="black"
                      className="bg-black/80 text-black"
                      my={4}
                      mr={5}
                    />
                    <MenuList className="bg-black text-black">
                      <MenuItem
                        // colorScheme="black"
                        className="text-black"
                        onClick={handleDownload}
                        icon={<Icon color={"black"} as={FiDownload} />}
                      >
                        <p className="text-black">Download</p>
                      </MenuItem>
                      <MenuItem className="bg-black text-black">
                        <Select
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                          fontSize="sm"
                          className="bg-black/80 text-black"
                        >
                          {[10, 20, 50, 100].map((value) => (
                            <option
                              className="text-black"
                              key={value}
                              value={value}
                            >
                              {value} Rows
                            </option>
                          ))}
                        </Select>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <Button
                    colorScheme="black"
                    ml="3"
                    className="bg-black/80 text-white"
                    onClick={handleUpdateClick}
                  >
                    Update Dataset
                  </Button>
                  <UpdateIPNS
                    isOpen={isUpdateOpen}
                    onClose={onUpdateClose}
                    isDataset={true}
                    IPNS={IPNS}
                    EncryptedKeyCID={EncryptedKeyCID}
                    currentCSV={csvText}
                    spaceID={spaceID}
                    isEncrypted={isEncrypted}
                  />
                </div>
              )}
            </Container>
          </Center>

          <Box p={4} overflowX="auto" maxWidth="100%" maxHeight={700}>
            {sortedData.length > 0 && (
              <Table variant="unstyled">
                <Thead>
                  <Tr>
                    {Object.keys(sortedData[0]).map((header, index) => (
                      <Th
                        key={index}
                        bg="#424242"
                        color="white"
                        borderRadius="lg"
                      >
                        {header}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {currentRows.map((row, rowIndex) => (
                    <Tr key={rowIndex} bg="#edf2f7" border="#424242" p={2}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <Td
                          key={cellIndex}
                          borderWidth="1px"
                          borderRadius="lg"
                          borderColor="#424242"
                          color="#424242"
                        >
                          {cell as any}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>

          <div>
            <SimpleGrid mt={4} columns={2} spacing={4}>
              <Button
                colorScheme="black"
                ml="3"
                className="bg-black/80 text-white"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                colorScheme="black"
                ml="3"
                className="bg-black/80 text-white"
                disabled={indexOfLastRow >= csvData.length}
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </Button>
            </SimpleGrid>
          </div>
        </>
      )}
    </div>
  );
};

export default DatasetViewer;
