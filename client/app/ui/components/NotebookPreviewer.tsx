// components/NotebookViewer.js
import { useState, useEffect } from "react";
import "react-ipynb-renderer/dist/styles/monokai.css";

import dynamic from "next/dynamic";

const IpynbRenderer = dynamic(
  () => import("react-ipynb-renderer").then((mod) => mod.IpynbRenderer),
  {
    ssr: false,
  },
);

export const NotebookPreviewer = ({ code }: { code: any }) => {
  const [notebookData, setNotebookData] = useState(null);

  useEffect(() => {
    async function fetchNotebook() {
      try {
        const data = await fetch(code).then((res) => res.json());
        console.log(data);
        setNotebookData(data);
      } catch (error) {
        console.error("Error fetching notebook:", error);
      }
    }

    fetchNotebook();
  }, []);

  return <div>{notebookData ? <IpynbRenderer ipynb={notebookData} /> : <p>Loading...</p>}</div>;
};

export default NotebookPreviewer;
