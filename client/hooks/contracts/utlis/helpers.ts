import { Address, Hex, PublicClient, WalletClient, encodeFunctionData, type BaseError } from "viem";

import { ProgressStatus } from "@/components/ProgressModal/types";
import { handleTransactionError } from "@/lib/transactionErrorHandler";

import {
  ContractTransaction,
  SafeTransaction,
  TransactionConfig,
  DEFAULT_CONFIG,
  TransactionState,
  TransactionStatus,
} from "./types";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a Safe transaction from a contract transaction
 * @param tx - The contract transaction to convert
 * @returns SafeTransaction object
 */
export const createSafeTransaction = (tx: ContractTransaction): SafeTransaction => {
  const transactionData = encodeFunctionData({
    abi: tx.abi,
    functionName: tx.functionName,
    args: tx.args,
  });

  return {
    to: tx.contractAddress,
    data: transactionData,
    value: tx.value?.toString() ?? "0",
  };
};

/**
 * Creates an initial transaction state
 * @param status - Initial status
 * @returns TransactionState object
 */
export const createTransactionState = (
  status: TransactionStatus = ProgressStatus.NOT_STARTED,
): TransactionState => ({
  status,
  timestamp: Date.now(),
});

/**
 * Updates transaction state with new properties
 * @param currentState - Current transaction state
 * @param updates - Partial updates to apply
 * @returns Updated TransactionState
 */
export const updateTransactionState = (
  currentState: TransactionState,
  updates: Partial<TransactionState>,
): TransactionState => ({
  ...currentState,
  ...updates,
  timestamp: Date.now(),
});

/**
 * Creates an error state from an error object
 * @param error - The error to convert
 * @returns TransactionState with error status
 */
export const createErrorState = (error: Error | BaseError): TransactionState => {
  const { title, description } = handleTransactionError(error as BaseError);
  return updateTransactionState(createTransactionState(), {
    status: ProgressStatus.IS_ERROR,
    error: {
      title,
      description,
    },
  });
};

/**
 * Validates required dependencies for transaction execution
 * @param publicClient - Public client instance
 * @param walletClient - Wallet client instance
 * @param address - User address
 * @throws Error if any dependency is missing
 */
export const validateTransactionDependencies = (
  publicClient: any,
  walletClient: any,
  address: any,
): void => {
  if (!publicClient || !walletClient || !address) {
    throw new Error("Public client, wallet client, or address is not available");
  }
};

// ============================================================================
// TRANSACTION EXECUTION FUNCTIONS
// ============================================================================

/**
 * Executes a single transaction in a Safe wallet
 * @param sdk - Safe SDK instance
 * @param transaction - Contract transaction to execute
 * @returns Promise<Hex> - Safe transaction hash
 */
export const executeSafeTransaction = async (
  sdk: any,
  transaction: ContractTransaction,
): Promise<Hex> => {
  const safeTransaction = createSafeTransaction(transaction);
  const { safeTxHash } = await sdk.txs.send({ txs: [safeTransaction] });
  return safeTxHash as Hex;
};

/**
 * Executes multiple transactions in a Safe wallet as a batch
 * @param sdk - Safe SDK instance
 * @param transactions - Array of contract transactions to execute
 * @returns Promise<Hex> - Safe transaction hash
 */
export const executeSafeBatchTransaction = async (
  sdk: any,
  transactions: ContractTransaction[],
): Promise<Hex> => {
  const safeTransactions = transactions.map(createSafeTransaction);
  const { safeTxHash } = await sdk.txs.send({ txs: safeTransactions });
  return safeTxHash as Hex;
};

/**
 * Executes a single transaction in a regular wallet
 * @param publicClient - Public client instance
 * @param walletClient - Wallet client instance
 * @param account - Account address
 * @param transaction - Contract transaction to execute
 * @param config - Transaction configuration
 * @returns Promise<Hex> - Transaction hash
 */
export const executeRegularTransaction = async (
  publicClient: PublicClient,
  walletClient: WalletClient,
  account: Address,
  transaction: ContractTransaction,
  config: Required<TransactionConfig> = DEFAULT_CONFIG,
): Promise<Hex> => {
  // Simulate the transaction first
  const { request } = await publicClient.simulateContract({
    address: transaction.contractAddress,
    abi: transaction.abi,
    functionName: transaction.functionName,
    args: transaction.args,
    value: transaction.value,
    account,
  });
  const gasEstimate = await estimateGas(publicClient, transaction, account);
  let optimizedRequest = request;
  if (gasEstimate) {
    optimizedRequest = {
      ...request,
      gas: BigInt(gasEstimate.gasLimit),
      maxFeePerGas: gasEstimate.maxFeePerGas,
      maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas,
    };
  }

  // Execute the transaction
  const hash = await walletClient.writeContract(optimizedRequest);

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: config.confirmations,
  });

  return hash;
};

/**
 * Executes multiple transactions in a regular wallet sequentially
 * @param publicClient - Public client instance
 * @param walletClient - Wallet client instance
 * @param transactions - Array of contract transactions to execute
 * @param config - Transaction configuration
 * @param onTransactionUpdate - Callback for transaction state updates
 * @returns Promise<Hex[]> - Array of transaction hashes
 */
export const executeRegularBatchTransaction = async (
  publicClient: PublicClient,
  walletClient: WalletClient,
  account: Address,
  transactions: ContractTransaction[],
  config: Required<TransactionConfig> = DEFAULT_CONFIG,
  onTransactionUpdate?: (index: number, state: TransactionState) => void,
): Promise<Hex[]> => {
  const results: Hex[] = [];

  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];

    try {
      // Update state to in progress
      onTransactionUpdate?.(i, createTransactionState(ProgressStatus.IN_PROGRESS));

      // Execute the transaction
      const hash = await executeRegularTransaction(
        publicClient,
        walletClient,
        account,
        transaction,
        config,
      );

      // Update state to success
      onTransactionUpdate?.(
        i,
        updateTransactionState(createTransactionState(), {
          status: ProgressStatus.IS_SUCCESS,
          hash,
        }),
      );

      results.push(hash);
    } catch (error) {
      // Update state to error
      onTransactionUpdate?.(i, createErrorState(error as Error));
      throw error; // Re-throw to stop execution
    }
  }

  return results;
};

export const estimateGas = async (
  publicClient: any,
  transaction: ContractTransaction,
  address: string,
) => {
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
      address: transaction.contractAddress,
      abi: transaction.abi,
      functionName: transaction.functionName,
      args: transaction.args,
      value: transaction.value,
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
    console.error(error);
    return;
  }
};

// ============================================================================
// STATE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates initial states for multiple transactions
 * @param count - Number of transactions
 * @param initialStatus - Initial status for all transactions
 * @returns Record of transaction states
 */
export const createInitialTransactionStates = (
  count: number,
  initialStatus: TransactionStatus = ProgressStatus.NOT_STARTED,
): Record<string, TransactionState> => {
  return Array.from({ length: count }, (_, index) => index).reduce(
    (acc, index) => {
      acc[index] = createTransactionState(initialStatus);
      return acc;
    },
    {} as Record<string, TransactionState>,
  );
};

/**
 * Updates all transaction states with the same status
 * @param states - Current transaction states
 * @param status - New status to apply
 * @param additionalData - Additional data to merge
 * @returns Updated transaction states
 */
export const updateAllTransactionStates = (
  states: Record<string, TransactionState>,
  status: TransactionStatus,
  additionalData?: Partial<TransactionState>,
): Record<string, TransactionState> => {
  return Object.keys(states).reduce(
    (acc, key) => {
      acc[key] = updateTransactionState(states[key], {
        status,
        ...additionalData,
      });
      return acc;
    },
    {} as Record<string, TransactionState>,
  );
};

/**
 * Updates failed transaction states to error status
 * @param states - Current transaction states
 * @param error - Error to apply to failed states
 * @returns Updated transaction states
 */
export const updateFailedTransactionStates = (
  states: Record<string, TransactionState>,
  error: Error | BaseError,
): Record<string, TransactionState> => {
  const { title, description } = handleTransactionError(error as BaseError);

  return Object.keys(states).reduce(
    (acc, key) => {
      const currentState = states[key];
      if (
        currentState.status === ProgressStatus.IN_PROGRESS ||
        currentState.status === ProgressStatus.NOT_STARTED
      ) {
        acc[key] = updateTransactionState(currentState, {
          status: ProgressStatus.IS_ERROR,
          error: { title, description },
        });
      } else {
        acc[key] = currentState;
      }
      return acc;
    },
    {} as Record<string, TransactionState>,
  );
};
