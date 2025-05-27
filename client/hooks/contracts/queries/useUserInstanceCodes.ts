import { useQuery } from "@tanstack/react-query";
import makeBlockie from "ethereum-blockies-base64";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { getIpfsGatewayUri, resolveIPNS } from "@/lib/ipfs";
import { getUserCodes } from "@/lib/tableland";

const fetchInstanceCodes = async (userAddress: any, address: any) => {
  const addr = isAddress(userAddress) ? userAddress : address;

  const data = await getUserCodes(addr);
  for (const key in data) {
    data[key].codeCID = getIpfsGatewayUri(await resolveIPNS(data[key].IPNS));
    data[key].blockie = makeBlockie(data[key].creator);
    data[key].creator = data[key].creator.toLowerCase();
  }
  console.log(data);
  return data;
};

export const useUserInstanceCodes = (userAddress: string) => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["instanceCodes", userAddress, address],
    queryFn: () => fetchInstanceCodes(userAddress, address),
  });
};
