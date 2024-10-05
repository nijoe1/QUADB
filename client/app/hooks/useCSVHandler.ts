import { useState } from "react";

export const useCSVHandler = () => {
  const [file, setFile] = useState();
  const [newRows, setNewRows] = useState([]);

  const handleUploadCSV = (event: any) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvString = e?.target?.result as string;
      const arrayFromCsv = csvToObjectArray(csvString);
      setNewRows(arrayFromCsv as never[]);
    };
    reader.readAsText(file);
  };

  const csvToObjectArray = (csvString: any) => {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(",").map((header: any) => header.trim());
    const objects = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const obj: { [key: string]: string } = {};
      values.forEach((value: string, index: number) => {
        obj[headers[index]] = value.trim();
      });
      objects.push(obj);
    }
    return objects;
  };

  const objectToCsv = (data: any) => {
    const keys = Object.keys(data[0]);
    const headerRow = keys.map((key) => key).join(",");
    const rows = data.map((obj: any) => {
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
  };

  const downloadCsv = (data: any, filename: any) => {
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
  };

  return {
    file,
    newRows,
    setNewRows,
    handleUploadCSV,
    downloadCsv,
    csvToObjectArray,
  };
};
