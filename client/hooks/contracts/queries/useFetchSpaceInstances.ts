import { useEffect, useState } from "react";

import { fetchIPFSFile } from "@/lib/ipfs";
import { getSpaceInstances } from "@/lib/tableland";

export const useFetchSpaceInstances = (spaceID: string) => {
  const [instances, setInstances] = useState({
    openInstances: [],
    openPrivateInstances: [],
    paidInstances: [],
    paidPrivateInstances: [],
  });
  const [fetched, setFetched] = useState(false);

  const getMetadataCID = async (data: any) => {
    const temp = [];
    for (const item of data) {
      if (!item.metadataCID) continue;
      try {
        const metadata = await fetchIPFSFile(item.metadataCID, true, "data.json");

        item.metadata = metadata; // obj that contains => name about imageUrl
      } catch (error) {
        console.error(error);
        continue;
      }
      temp.push(item); // Push fetched JSON metadata directly
    }
    return temp;
  };

  const fetchInstances = async () => {
    let data = await getSpaceInstances(spaceID);
    if (!(data && data[0] && data[0].instances && data[0].instances.length !== 0)) {
      return [];
    }

    data = data[0].instances;
    const dataObj = {} as any;
    for (const key in data) {
      if (
        key === "openInstances" ||
        key === "openPrivateInstances" ||
        key === "paidInstances" ||
        key === "paidPrivateInstances"
      ) {
        const instancesArray = data[key].map(JSON.parse); // Parse each stringified JSON object
        dataObj[key] = await getMetadataCID(instancesArray);
      }
    }
    return dataObj;
  };

  useEffect(() => {
    fetchInstances().then((resp) => {
      setInstances(resp);
      setFetched(true);
    });
  }, [spaceID]);

  return { instances, fetched } as { instances: any; fetched: boolean };
};
