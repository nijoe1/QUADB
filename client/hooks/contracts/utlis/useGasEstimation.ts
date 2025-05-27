import { parseEther } from "viem";
import { useAccount, usePublicClient } from "wagmi";

interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  totalCost: bigint;
}

export const useGasEstimation = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const estimateGas = async (
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[],
    value?: string,
  ): Promise<GasEstimate> => {
    try {
      if (!publicClient) {
        throw new Error("Public client not found");
      }

      // Get the current base fee
      const block = await publicClient.getBlock();
      const baseFee = block.baseFeePerGas || BigInt(0);

      // Get max priority fee (tip)
      const maxPriorityFeePerGas = await publicClient.estimateMaxPriorityFeePerGas();

      // Estimate gas limit for the transaction
      const gasLimit = await publicClient.estimateContractGas({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args,
        value: value ? parseEther(value) : undefined,
        account: address,
      });

      // Add 60% buffer to gas limit for safety
      const gasLimitWithBuffer = (gasLimit * BigInt(160)) / BigInt(100);

      // Calculate max fee per gas (base fee + priority fee)
      const maxFeePerGas = baseFee + maxPriorityFeePerGas;

      // Calculate total cost
      const totalCost = gasLimitWithBuffer * maxFeePerGas;

      return {
        gasLimit: gasLimitWithBuffer,
        gasPrice: maxFeePerGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        totalCost,
      };
    } catch (error) {
      console.error("Error estimating gas:", error);
      throw error;
    }
  };

  const formatGasEstimate = (estimate: GasEstimate) => {
    return {
      gasLimit: estimate.gasLimit.toString(),
      gasPrice: estimate.gasPrice.toString(),
      maxFeePerGas: estimate.maxFeePerGas.toString(),
      maxPriorityFeePerGas: estimate.maxPriorityFeePerGas.toString(),
      totalCost: estimate.totalCost.toString(),
    };
  };

  return {
    estimateGas,
    formatGasEstimate,
  };
};
