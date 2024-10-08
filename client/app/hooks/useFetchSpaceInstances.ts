import { useEffect, useState } from "react";
import { getSpaceInstances } from "@/app/lib/tableland";
import { getIpfsGatewayUri } from "@/app/lib/ipfs";
import axios from "axios";

const useFetchSpaceInstances = (spaceID: string) => {
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
      const metadataCIDLink = getIpfsGatewayUri(item.metadataCID);
      const res = await axios(metadataCIDLink);
      item.metadata = res.data; // obj that contains => name about imageUrl
      temp.push(item); // Push fetched JSON metadata directly
    }
    return temp;
  };

  const fetchInstances = async () => {
    const data = (await getSpaceInstances(spaceID))[0]?.instances;
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

export default useFetchSpaceInstances;
