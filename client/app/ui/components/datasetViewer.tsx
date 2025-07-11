import { useState, useEffect } from "react";

import { Download, MoreVertical } from "lucide-react";

import { useStorachaProvider } from "@/app/providers/StorachaProvider";
import Loading from "@/components/animation/loading";
import { fetchIPFSFile } from "@/lib/ipfs";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Button } from "@/primitives/Button";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Container } from "@/ui-shadcn/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui-shadcn/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui-shadcn/select";

type CsvData = Record<string, string | number | undefined>[];

export const DatasetViewer = ({ cid }: { cid: string }) => {
  const [csvData, setCsvData] = useState<CsvData>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [fetched, setFetched] = useState<boolean>(false);
  const { client } = useStorachaProvider();

  useEffect(() => {
    if (cid) {
      fetchCsvData();
    }
  }, [cid]);

  const fetchCsvData = async () => {
    try {
      const text = await fetchIPFSFile(cid, false, undefined);
      const parsedData = customCsvParser(text);
      if (parsedData) {
        setCsvData(parsedData);
        setFetched(true);
      } else {
        throw new Error("Failed to parse CSV file");
      }
    } catch (error: any) {
      showToast.error("Error", error.message);
    }
  };

  const customCsvParser = (csvString: string): CsvData => {
    const rows = csvString.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const rowData: Record<string, string | number | undefined> = {};
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
    const csvString = csvData.map((row) => Object.values(row).join(",")).join("\n");
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

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
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
          <div className="flex justify-center">
            <Container>
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="bg-black/80 text-white"
                      icon={<MoreVertical className="size-4" />}
                    ></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-none bg-black text-white shadow-md">
                    <DropdownMenuItem
                      onClick={handleDownload}
                      className="justify-center gap-1 p-1 text-xs text-white hover:bg-grey-300 hover:text-black"
                    >
                      <Download className="mr-2 size-4" />
                      <span className="text-xs">Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-grey-700">
                      <Select
                        value={rowsPerPage.toString()}
                        onValueChange={handleRowsPerPageChange}
                      >
                        <SelectTrigger className="w-full border-grey-600 bg-black/80 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-grey-600 bg-black text-white">
                          {[10, 20, 50, 100].map((value) => (
                            <SelectItem
                              key={value}
                              value={value.toString()}
                              className="text-white hover:bg-grey-100"
                            >
                              {value} Rows
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Container>
          </div>

          <Card className="max-h-[700px] max-w-full overflow-x-auto rounded-2xl border-none p-0">
            <CardContent className="p-0">
              {sortedData.length > 0 && (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {Object.keys(sortedData[0]).map((header, index) => (
                        <th
                          key={index}
                          className={cn(
                            "rounded-lg border border-[#424242] bg-[#424242] p-3 text-white",
                          )}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={cn("border border-[#424242] bg-[#edf2f7]")}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={cn("rounded-lg border border-[#424242] p-3 text-[#424242]")}
                          >
                            {cell as any}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button
              className="bg-black/80 text-white disabled:cursor-not-allowed disabled:bg-black/30 disabled:text-grey-500"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              value="Previous"
            />
            <Button
              className="bg-black/80 text-white disabled:cursor-not-allowed disabled:bg-black/30 disabled:text-grey-500"
              disabled={indexOfLastRow >= csvData.length}
              onClick={() => paginate(currentPage + 1)}
              value="Next"
            />
          </div>
        </>
      )}
    </div>
  );
};
