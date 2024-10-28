import { useAccount } from "wagmi";

export const useChainName = () => {
  const { chainId } = useAccount();
  if (!chainId) {
    return "filecoin";
  }
  const chainName = chainId === 314 ? "filecoin" : "calibration";
  return chainName;
};
