import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getInstance, getInstanceMembers } from "@/lib/tableland";
import { getIpfsGatewayUri, resolveIPNS } from "@/lib/ipfs";

const fetchInstanceData = async (instanceID: string) => {
  const data = await getInstance(instanceID);
  const members = await getInstanceMembers(instanceID);
  const temp = new Set();
  temp.add(data[0].creator?.toLowerCase());
  members.forEach((member: any) => {
    temp.add(member.member?.toLowerCase());
  });

  const metadataCIDLink = getIpfsGatewayUri(data[0].metadataCID);
  const res = await axios(metadataCIDLink);
  data[0].metadata = res.data;
  data[0].cid = await resolveIPNS(data[0].IPNS);

  temp.add(data[0].creator?.toLowerCase());
  return {
    instance: data[0],
    instanceMembers: Array.from(temp),
  };
};

const useInstanceData = (instanceID: string) => {
  return useQuery({
    queryKey: ["instanceData", instanceID],
    queryFn: () => fetchInstanceData(instanceID),
    enabled: !!instanceID,
  });
};

export default useInstanceData;
