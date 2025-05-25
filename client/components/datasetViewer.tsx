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
import Loading from "@/components/animation/loading";
import { Container } from "@/ui-shadcn/container";
import UpdateIPNS from "@/components/UpdateIPNS";
import { useAccount } from "wagmi";

type CsvData = { [key: string]: string | number | undefined }[];

const DatasetViewer = ({
  cid,
  IPNS,
  EncryptedKeyCID,
  isEncrypted,
  spaceID,
  threshold,
}: {
  cid: string;
  IPNS: string;
  EncryptedKeyCID: string;
  isEncrypted: boolean;
  spaceID: string;
  threshold?: number;
}) => {
  const toast = useToast();
  const [csvData, setCsvData] = useState<CsvData>([]);
  const [csvText, setCsvText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [fetched, setFetched] = useState<boolean>(false);
  const { address } = useAccount();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  useEffect(() => {
    if (cid) {
      fetchCsvData();
    }
  }, [cid]);

  const fetchCsvData = async () => {
    try {
      const response = await fetch(
        "https://gateway.lighthouse.storage/ipfs/" + cid
      );
      if (!response.ok) {
        throw new Error("Failed to fetch CSV file");
      }
      const text = await response.text();
      setCsvText(text);
      const parsedData = customCsvParser(text);
      if (parsedData) {
        setCsvData(parsedData);
        setFetched(true);
      } else {
        throw new Error("Failed to parse CSV file");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const customCsvParser = (csvString: string): CsvData => {
    const rows = csvString.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const rowData: { [key: string]: string | number | undefined } = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
  };

  // Define sortedData as a sorted copy of csvData
  const sortedData = [...csvData].sort((a, b) => {
    // Example: Sorting by a specific column, adjust as needed
    return a["Champion"] && b["Champion"]
      ? (a["Champion"] as string).localeCompare(b["Champion"] as string)
      : 0;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const handleDownload = () => {
    const csvString = csvData
      .map((row) => Object.values(row).join(","))
      .join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      {!fetched ? (
        <div className="mx-auto mt-[10%] flex flex-col items-center">
          <Loading />
        </div>
      ) : (
        <>
          <Center>
            <Container>
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
                  onClick={onUpdateOpen}
                >
                  Update Dataset
                </Button>
                <UpdateIPNS
                  isOpen={isUpdateOpen}
                  onClose={onUpdateClose}
                  isDataset={true}
                  IPNS={IPNS}
                  currentIPNSValue={cid}
                  EncryptedKeyCID={EncryptedKeyCID}
                  currentCSV={csvText}
                  spaceID={spaceID}
                  isEncrypted={isEncrypted}
                  threshold={threshold || 0}
                />
              </div>
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
