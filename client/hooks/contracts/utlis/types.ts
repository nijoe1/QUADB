import { Abi, Address, Hex } from "viem";

import { ProgressStatus } from "@/components/ProgressModal/types";

/**
 * Represents the status of a transaction
 */
export type TransactionStatus = ProgressStatus;

/**
 * Represents the state of a transaction
 */
export interface TransactionState {
  status: TransactionStatus;
  hash?: Hex;
  error?: {
    title: string;
    description: string;
  };
  timestamp: number;
}

/**
 * Represents a single contract transaction
 */
export interface ContractTransaction {
  /** The contract's ABI */
  abi: Abi;
  /** The function name to call */
  functionName: string;
  /** The arguments to pass to the function */
  args: any[];
  /** The contract address */
  contractAddress: Address;
  /** Optional value to send with the transaction */
  value?: bigint;
}

/**
 * Represents a Safe transaction
 */
export interface SafeTransaction {
  to: Address;
  data: Hex;
  value: string;
}

/**
 * Configuration for transaction execution
 */
export interface TransactionConfig {
  confirmations?: number;
  timeout?: number;
}

/**
 * Default transaction configuration
 */
export const DEFAULT_CONFIG: Required<TransactionConfig> = {
  confirmations: 1,
  timeout: 1000 * 60 * 2, // 2 minutes
};
