import { useQuery } from "@tanstack/react-query";
import { getUserCodes } from "@/lib/tableland";
import { getIpfsGatewayUri, resolveIPNS } from "@/lib/ipfs";
import makeBlockie from "ethereum-blockies-base64";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

const fetchInstanceCodes = async (userAddress: any, address: any) => {
  let addr = isAddress(userAddress) ? userAddress : address;

  const data = await getUserCodes(addr);
  for (const key in data) {
    data[key].codeCID = getIpfsGatewayUri(await resolveIPNS(data[key].IPNS));
    data[key].blockie = makeBlockie(data[key].creator);
    data[key].creator = data[key].creator.toLowerCase();
  }
  console.log(data);
  return data;
};

const useUserInstanceCodes = (userAddress: string) => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["instanceCodes", userAddress, address],
    queryFn: () => fetchInstanceCodes(userAddress, address),
  });
};

export default useUserInstanceCodes;
