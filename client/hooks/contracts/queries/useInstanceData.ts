import { useQuery } from "@tanstack/react-query";

import { fetchIPFSFile, resolveIPNS } from "@/lib/ipfs";
import { getInstance, getInstanceMembers } from "@/lib/tableland";

const fetchInstanceData = async (instanceID: string) => {
  const instance = (await getInstance(instanceID))[0];
  const members = await getInstanceMembers(instanceID);
  const contributors = new Set();
  contributors.add(instance.creator?.toLowerCase());
  members.forEach((member: any) => {
    contributors.add(member.member?.toLowerCase());
  });

  const metadata = await fetchIPFSFile(instance.metadataCID, true, "data.json");
  instance.metadata = metadata;
  instance.cid = await resolveIPNS(instance.IPNS);

  if (instance.creator) {
    contributors.add(instance.creator.toLowerCase());
  }
  return {
    instance: instance,
    instanceMembers: Array.from(contributors),
  };
};

export const useInstanceData = (instanceID: string) => {
  return useQuery({
    queryKey: ["instanceData", instanceID],
    queryFn: () => fetchInstanceData(instanceID),
    enabled: !!instanceID,
  });
};
