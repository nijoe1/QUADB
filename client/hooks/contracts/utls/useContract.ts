import { useMutation } from "@tanstack/react-query";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { Address, Hex, encodeFunctionData, type BaseError } from "viem";
import { useCheckIsSafeWallet } from "./useCheckIsSafeWallet";
import { handleTransactionError } from "@/lib/transactionErrorHandler";
import { useState, useCallback } from "react";

/**
 * Represents the status of a transaction
 */
export type TransactionStatus =
  | "idle"
  | "pending"
  | "success"
  | "error"
  | "simulating";

/**
 * Represents the state of a transaction
 */
export interface TransactionState {
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: Error;
  timestamp: number;
}

/**
 * Represents a single contract transaction
 */
export interface ContractTransaction {
  /** The contract's ABI */
  abi: any[];
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
interface SafeTransaction {
  to: Address;
  data: Hex;
  value: string;
}

/**
 * Creates a Safe transaction from a contract transaction
 */
const createSafeTransaction = (tx: ContractTransaction): SafeTransaction => {
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
 * Hook for executing contract transactions with comprehensive state management and error handling.
 * Supports both Safe and regular wallet transactions with automatic detection.
 *
 * @returns {Object} An object containing:
 * @returns {Object} executeContractTransaction - The mutation function for executing a single transaction
 * @returns {Object} executeContractTransaction.mutateAsync - Async function to execute a transaction
 * @returns {Object} executeContractTransaction.mutate - Function to execute a transaction with callbacks
 * @returns {Object} executeContractTransaction.isPending - Boolean indicating if transaction is pending
 * @returns {Object} executeContractTransaction.isError - Boolean indicating if transaction failed
 * @returns {Object} executeContractTransaction.error - Error object if transaction failed
 * @returns {Object} transactionState - Current state of the transaction
 * @returns {Object} transactionState.status - Current status: 'idle' | 'pending' | 'success' | 'error' | 'simulating'
 * @returns {Object} transactionState.hash - Transaction hash if successful
 * @returns {Object} transactionState.error - Error object if failed
 * @returns {Object} transactionState.timestamp - Timestamp of the last state change
 * @returns {Function} resetTransactionState - Function to reset the transaction state
 *
 * @example
 * ```typescript
 * const {
 *   executeContractTransaction,
 *   transactionState,
 *   resetTransactionState
 * } = useContractTransaction();
 *
 * // Basic usage with mutateAsync
 * const transferTx = {
 *   abi: erc20ABI,
 *   functionName: "transfer",
 *   args: ["0x123...", "1000000000000000000"],
 *   contractAddress: "0x456...",
 * };
 *
 * // Method 1: Using mutateAsync (recommended for async/await)
 * try {
 *   const hash = await executeContractTransaction.mutateAsync(transferTx);
 *   console.log("Transaction successful:", hash);
 * } catch (error) {
 *   console.error("Transaction failed:", error);
 * }
 *
 * // Method 2: Using mutate with callbacks
 * executeContractTransaction.mutate(transferTx, {
 *   onSuccess: (hash) => {
 *     console.log("Transaction successful:", hash);
 *     // Additional success handling
 *   },
 *   onError: (error) => {
 *     console.error("Transaction failed:", error);
 *     // Additional error handling
 *   },
 *   onSettled: () => {
 *     console.log("Transaction completed");
 *     // Cleanup or final state updates
 *   }
 * });
 *
 * // Method 3: Using with React Query's built-in states
 * if (executeContractTransaction.isPending) {
 *   return <div>Transaction pending...</div>;
 * }
 *
 * if (executeContractTransaction.isError) {
 *   return <div>Error: {executeContractTransaction.error.message}</div>;
 * }
 *
 * // Method 4: Using with transaction state
 * useEffect(() => {
 *   if (transactionState.status === "success") {
 *     // Handle success
 *     console.log("Transaction hash:", transactionState.hash);
 *   } else if (transactionState.status === "error") {
 *     // Handle error
 *     console.error("Transaction error:", transactionState.error);
 *   }
 * }, [transactionState]);
 *
 * // Reset state when needed
 * const handleReset = () => {
 *   resetTransactionState();
 *   // Additional reset logic
 * };
 * ```
 */
export const useContractTransaction = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { sdk } = useSafeAppsSDK();
  const isSafeWallet = useCheckIsSafeWallet();
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: "idle",
    timestamp: Date.now(),
  });

  const resetTransactionState = useCallback(() => {
    setTransactionState({
      status: "idle",
      timestamp: Date.now(),
    });
  }, []);

  /**
   * Executes a single contract transaction
   * @param contractTransaction - The contract transaction to execute
   * @returns Promise<Hex> - The transaction hash
   *
   * @example
   * ```typescript
   * // ERC20 transfer
   * const transferTx = {
   *   abi: erc20ABI,
   *   functionName: "transfer",
   *   args: ["0x123...", "1000000000000000000"],
   *   contractAddress: "0x456...",
   * };
   * const hash = await executeContractTransaction.mutateAsync(transferTx);
   *
   * // ERC721 mint
   * const mintTx = {
   *   abi: erc721ABI,
   *   functionName: "mint",
   *   args: ["0x123..."],
   *   contractAddress: "0x789...",
   *   value: parseEther("0.1"), // Optional value in wei
   * };
   * const hash = await executeContractTransaction.mutateAsync(mintTx);
   * ```
   */
  const executeContractTransaction = useMutation({
    mutationFn: async (contractTransaction: ContractTransaction) => {
      setTransactionState({
        status: "simulating",
        timestamp: Date.now(),
      });

      if (isSafeWallet) {
        const tx = createSafeTransaction(contractTransaction);
        setTransactionState({
          status: "pending",
          timestamp: Date.now(),
        });
        const { safeTxHash } = await sdk.txs.send({ txs: [tx] });
        setTransactionState({
          status: "success",
          hash: safeTxHash as Hex,
          timestamp: Date.now(),
        });
        return safeTxHash;
      } else {
        if (!publicClient || !walletClient || !address) {
          const error = new Error(
            "Public client, wallet client, or address is not available"
          );
          setTransactionState({
            status: "error",
            error,
            timestamp: Date.now(),
          });
          throw error;
        }

        try {
          const { request } = await publicClient.simulateContract({
            address: contractTransaction.contractAddress,
            abi: contractTransaction.abi,
            functionName: contractTransaction.functionName,
            args: contractTransaction.args,
            value: contractTransaction.value,
          });

          setTransactionState({
            status: "pending",
            timestamp: Date.now(),
          });

          const hash = await walletClient.writeContract(request);
          await publicClient.waitForTransactionReceipt({
            hash,
            confirmations: 1,
          });

          setTransactionState({
            status: "success",
            hash,
            timestamp: Date.now(),
          });
          return hash;
        } catch (error) {
          setTransactionState({
            status: "error",
            error: error as Error,
            timestamp: Date.now(),
          });
          handleTransactionError(error as BaseError);
        }
      }
    },
  });

  return {
    executeContractTransaction,
    transactionState,
    resetTransactionState,
  };
};

/**
 * Hook for executing multiple contract transactions with comprehensive state management.
 * Supports both Safe and regular wallet transactions with automatic detection.
 * For Safe wallets, it batches all transactions into a single Safe transaction.
 * For regular wallets, it executes transactions sequentially.
 *
 * @returns {Object} An object containing:
 * @returns {Object} executeMultiContractTransaction - The mutation function for executing multiple transactions
 * @returns {Object} executeMultiContractTransaction.mutateAsync - Async function to execute multiple transactions
 * @returns {Object} executeMultiContractTransaction.mutate - Function to execute multiple transactions with callbacks
 * @returns {Object} executeMultiContractTransaction.isPending - Boolean indicating if any transaction is pending
 * @returns {Object} executeMultiContractTransaction.isError - Boolean indicating if any transaction failed
 * @returns {Object} executeMultiContractTransaction.error - Error object if any transaction failed
 * @returns {Object} transactionStates - Record of transaction states indexed by transaction index
 * @returns {Object} transactionStates[index].status - Status of each transaction: 'idle' | 'pending' | 'success' | 'error' | 'simulating'
 * @returns {Object} transactionStates[index].hash - Transaction hash if successful
 * @returns {Object} transactionStates[index].error - Error object if failed
 * @returns {Object} transactionStates[index].timestamp - Timestamp of the last state change
 * @returns {Function} resetTransactionStates - Function to reset all transaction states
 *
 * @example
 * ```typescript
 * const {
 *   executeMultiContractTransaction,
 *   transactionStates,
 *   resetTransactionStates
 * } = useMultiContractTransaction();
 *
 * // Prepare multiple transactions
 * const transactions = [
 *   {
 *     abi: erc20ABI,
 *     functionName: "transfer",
 *     args: ["0x123...", "1000000000000000000"],
 *     contractAddress: "0x456...",
 *   },
 *   {
 *     abi: erc721ABI,
 *     functionName: "mint",
 *     args: ["0x123..."],
 *     contractAddress: "0x789...",
 *     value: parseEther("0.1"),
 *   }
 * ];
 *
 * // Method 1: Using mutateAsync (recommended for async/await)
 * try {
 *   const hashes = await executeMultiContractTransaction.mutateAsync(transactions);
 *   console.log("Transactions successful:", hashes);
 * } catch (error) {
 *   console.error("Transactions failed:", error);
 * }
 *
 * // Method 2: Using mutate with callbacks
 * executeMultiContractTransaction.mutate(transactions, {
 *   onSuccess: (hashes) => {
 *     console.log("Transactions successful:", hashes);
 *     // Additional success handling
 *   },
 *   onError: (error) => {
 *     console.error("Transactions failed:", error);
 *     // Additional error handling
 *   },
 *   onSettled: () => {
 *     console.log("All transactions completed");
 *     // Cleanup or final state updates
 *   }
 * });
 *
 * // Method 3: Using with React Query's built-in states
 * if (executeMultiContractTransaction.isPending) {
 *   return <div>Transactions pending...</div>;
 * }
 *
 * if (executeMultiContractTransaction.isError) {
 *   return <div>Error: {executeMultiContractTransaction.error.message}</div>;
 * }
 *
 * // Method 4: Using with transaction states
 * useEffect(() => {
 *   Object.entries(transactionStates).forEach(([index, state]) => {
 *     if (state.status === "success") {
 *       console.log(`Transaction ${index} successful:`, state.hash);
 *     } else if (state.status === "error") {
 *       console.error(`Transaction ${index} failed:`, state.error);
 *     }
 *   });
 * }, [transactionStates]);
 *
 * // Reset states when needed
 * const handleReset = () => {
 *   resetTransactionStates();
 *   // Additional reset logic
 * };
 * ```
 */
export const useMultiContractTransaction = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { sdk } = useSafeAppsSDK();
  const isSafeWallet = useCheckIsSafeWallet();
  const [transactionStates, setTransactionStates] = useState<
    Record<string, TransactionState>
  >({});

  const resetTransactionStates = useCallback(() => {
    setTransactionStates({});
  }, []);

  /**
   * Executes multiple contract transactions
   * @param contractTransactions - Array of contract transactions to execute
   * @returns Promise<Hex | Hex[]> - For Safe wallets: single transaction hash, For regular wallets: array of transaction hashes
   *
   * @example
   * ```typescript
   * // Multiple ERC20 transfers
   * const transfers = [
   *   {
   *     abi: erc20ABI,
   *     functionName: "transfer",
   *     args: ["0x123...", "1000000000000000000"],
   *     contractAddress: "0x456...",
   *   },
   *   {
   *     abi: erc20ABI,
   *     functionName: "transfer",
   *     args: ["0x789...", "2000000000000000000"],
   *     contractAddress: "0x456...",
   *   }
   * ];
   *
   * // In Safe wallet: single hash for all transactions
   * // In regular wallet: array of hashes for each transaction
   * const hashes = await executeMultiContractTransaction.mutateAsync(transfers);
   *
   * // Complex transaction sequence
   * const complexSequence = [
   *   {
   *     abi: erc20ABI,
   *     functionName: "approve",
   *     args: ["0x123...", "1000000000000000000"],
   *     contractAddress: "0x456...",
   *   },
   *   {
   *     abi: stakingABI,
   *     functionName: "stake",
   *     args: ["1000000000000000000"],
   *     contractAddress: "0x789...",
   *   }
   * ];
   * const hashes = await executeMultiContractTransaction.mutateAsync(complexSequence);
   * ```
   */
  const executeMultiContractTransaction = useMutation({
    mutationFn: async (contractTransactions: ContractTransaction[]) => {
      // Initialize states for all transactions
      const initialStates = contractTransactions.reduce(
        (acc, tx, index) => {
          acc[index] = {
            status: "simulating",
            timestamp: Date.now(),
          };
          return acc;
        },
        {} as Record<string, TransactionState>
      );

      setTransactionStates(initialStates);

      if (isSafeWallet) {
        // For Safe wallets, batch all transactions
        const safeTransactions = contractTransactions.map(
          createSafeTransaction
        );

        // Update all states to pending
        setTransactionStates((prev) =>
          Object.keys(prev).reduce(
            (acc, key) => {
              acc[key] = {
                ...prev[key],
                status: "pending",
                timestamp: Date.now(),
              };
              return acc;
            },
            {} as Record<string, TransactionState>
          )
        );

        const { safeTxHash } = await sdk.txs.send({ txs: safeTransactions });

        // Update all states to success
        setTransactionStates((prev) =>
          Object.keys(prev).reduce(
            (acc, key) => {
              acc[key] = {
                ...prev[key],
                status: "success",
                hash: safeTxHash as Hex,
                timestamp: Date.now(),
              };
              return acc;
            },
            {} as Record<string, TransactionState>
          )
        );

        return safeTxHash;
      } else {
        if (!publicClient || !walletClient || !address) {
          const error = new Error(
            "Public client, wallet client, or address is not available"
          );
          setTransactionStates((prev) =>
            Object.keys(prev).reduce(
              (acc, key) => {
                acc[key] = {
                  ...prev[key],
                  status: "error",
                  error,
                  timestamp: Date.now(),
                };
                return acc;
              },
              {} as Record<string, TransactionState>
            )
          );
          throw error;
        }

        try {
          // For regular wallets, execute transactions sequentially
          const results = [];
          for (let i = 0; i < contractTransactions.length; i++) {
            const tx = contractTransactions[i];

            setTransactionStates((prev) => ({
              ...prev,
              [i]: { ...prev[i], status: "simulating", timestamp: Date.now() },
            }));

            const { request } = await publicClient.simulateContract({
              address: tx.contractAddress,
              abi: tx.abi,
              functionName: tx.functionName,
              args: tx.args,
              value: tx.value,
            });

            setTransactionStates((prev) => ({
              ...prev,
              [i]: { ...prev[i], status: "pending", timestamp: Date.now() },
            }));

            const hash = await walletClient.writeContract(request);
            await publicClient.waitForTransactionReceipt({
              hash,
              confirmations: 1,
            });

            setTransactionStates((prev) => ({
              ...prev,
              [i]: {
                ...prev[i],
                status: "success",
                hash,
                timestamp: Date.now(),
              },
            }));

            results.push(hash);
          }
          return results;
        } catch (error) {
          // Update all remaining states to error
          setTransactionStates((prev) =>
            Object.keys(prev).reduce(
              (acc, key) => {
                if (
                  prev[key].status === "pending" ||
                  prev[key].status === "simulating"
                ) {
                  acc[key] = {
                    ...prev[key],
                    status: "error",
                    error: error as Error,
                    timestamp: Date.now(),
                  };
                } else {
                  acc[key] = prev[key];
                }
                return acc;
              },
              {} as Record<string, TransactionState>
            )
          );
          handleTransactionError(error as BaseError);
        }
      }
    },
  });

  return {
    executeMultiContractTransaction,
    transactionStates,
    resetTransactionStates,
  };
};
