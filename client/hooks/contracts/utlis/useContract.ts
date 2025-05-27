import { useState, useCallback } from "react";

import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";

import { ProgressStatus } from "@/components/ProgressModal/types";

import {
  createTransactionState,
  updateTransactionState,
  createErrorState,
  validateTransactionDependencies,
  executeSafeTransaction,
  executeSafeBatchTransaction,
  executeRegularTransaction,
  executeRegularBatchTransaction,
  createInitialTransactionStates,
  updateAllTransactionStates,
  updateFailedTransactionStates,
} from "./helpers";
import { ContractTransaction, TransactionConfig, DEFAULT_CONFIG, TransactionState } from "./types";
import { useCheckIsSafeWallet } from "./useCheckIsSafeWallet";

export const useContractTransaction = (config?: TransactionConfig) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { sdk } = useSafeAppsSDK();
  const isSafeWallet = useCheckIsSafeWallet();
  const [transactionState, setTransactionState] =
    useState<TransactionState>(createTransactionState());
  const transactionConfig = { ...DEFAULT_CONFIG, ...config };

  const resetTransactionState = useCallback(() => {
    setTransactionState(createTransactionState());
  }, []);

  /**
   * Executes a single contract transaction
   * @param contractTransaction - The contract transaction to execute
   * @returns Promise<Hex> - The transaction hash
   */
  const executeContractTransaction = useMutation({
    mutationFn: async (contractTransaction: ContractTransaction) => {
      setTransactionState(createTransactionState(ProgressStatus.IN_PROGRESS));

      try {
        validateTransactionDependencies(publicClient, walletClient, address as Address);

        let hash: Hex;

        if (isSafeWallet) {
          hash = await executeSafeTransaction(sdk, contractTransaction);
        } else {
          hash = await executeRegularTransaction(
            publicClient!,
            walletClient!,
            address as Address,
            contractTransaction,
            transactionConfig,
          );
        }

        setTransactionState(
          updateTransactionState(createTransactionState(), {
            status: ProgressStatus.IS_SUCCESS,
            hash,
          }),
        );

        return hash;
      } catch (error) {
        const errorState = createErrorState(error as Error);
        setTransactionState(errorState);
        throw error;
      }
    },
  });

  return {
    executeContractTransaction,
    transactionState,
    resetTransactionState,
  };
};

export const useMultiContractTransaction = (config?: TransactionConfig) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { sdk } = useSafeAppsSDK();
  const isSafeWallet = useCheckIsSafeWallet();
  const [transactionStates, setTransactionStates] = useState<Record<string, TransactionState>>({});

  const transactionConfig = { ...DEFAULT_CONFIG, ...config };

  const resetTransactionStates = useCallback(() => {
    setTransactionStates({});
  }, []);

  /**
   * Executes multiple contract transactions
   * @param contractTransactions - Array of contract transactions to execute
   * @returns Promise<Hex | Hex[]> - For Safe wallets: single transaction hash, For regular wallets: array of transaction hashes
   */
  const executeMultiContractTransaction = useMutation({
    mutationFn: async (contractTransactions: ContractTransaction[]) => {
      try {
        validateTransactionDependencies(publicClient, walletClient, address);

        // Initialize states for all transactions
        const initialStates = createInitialTransactionStates(
          contractTransactions.length,
          ProgressStatus.IN_PROGRESS,
        );
        setTransactionStates(initialStates);

        if (isSafeWallet) {
          // For Safe wallets, batch all transactions
          setTransactionStates((prev) =>
            updateAllTransactionStates(prev, ProgressStatus.IN_PROGRESS),
          );

          const safeTxHash = await executeSafeBatchTransaction(sdk, contractTransactions);

          // Update all states to success
          setTransactionStates((prev) =>
            updateAllTransactionStates(prev, ProgressStatus.IS_SUCCESS, {
              hash: safeTxHash,
            }),
          );

          return safeTxHash;
        } else {
          // For regular wallets, execute transactions sequentially
          const results = await executeRegularBatchTransaction(
            publicClient!,
            walletClient!,
            address as Address,
            contractTransactions,
            transactionConfig,
            (index, state) => {
              setTransactionStates((prev) => ({
                ...prev,
                [index]: state,
              }));
            },
          );

          return results;
        }
      } catch (error) {
        // Update all failed states to error
        setTransactionStates((prev) => updateFailedTransactionStates(prev, error as Error));
        throw error;
      }
    },
  });

  return {
    executeMultiContractTransaction,
    transactionStates,
    resetTransactionStates,
  };
};
