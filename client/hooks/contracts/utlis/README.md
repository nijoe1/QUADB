/\*\*

- Hook for executing multiple contract transactions with comprehensive state management.
- Supports both Safe and regular wallet transactions with automatic detection.
- For Safe wallets, it batches all transactions into a single Safe transaction.
- For regular wallets, it executes transactions sequentially.
-
- @param config - Optional transaction configuration
- @returns {Object} An object containing:
- @returns {Object} executeMultiContractTransaction - The mutation function for executing multiple transactions
- @returns {Object} executeMultiContractTransaction.mutateAsync - Async function to execute multiple transactions
- @returns {Object} executeMultiContractTransaction.mutate - Function to execute multiple transactions with callbacks
- @returns {Object} executeMultiContractTransaction.isPending - Boolean indicating if any transaction is pending
- @returns {Object} executeMultiContractTransaction.isError - Boolean indicating if any transaction failed
- @returns {Object} executeMultiContractTransaction.error - Error object if any transaction failed
- @returns {Object} transactionStates - Record of transaction states indexed by transaction index
- @returns {Object} transactionStates[index].status - Status of each transaction: 'idle' | 'pending' | 'success' | 'error' | 'simulating'
- @returns {Object} transactionStates[index].hash - Transaction hash if successful
- @returns {Object} transactionStates[index].error - Error object if failed
- @returns {Object} transactionStates[index].timestamp - Timestamp of the last state change
- @returns {Function} resetTransactionStates - Function to reset all transaction states
-
- @example
- ```typescript

  ```

- const {
- executeMultiContractTransaction,
- transactionStates,
- resetTransactionStates
- } = useMultiContractTransaction();
-
- // Prepare multiple transactions
- const transactions = [
- {
-     abi: erc20ABI,
-     functionName: "transfer",
-     args: ["0x123...", "1000000000000000000"],
-     contractAddress: "0x456...",
- },
- {
-     abi: erc721ABI,
-     functionName: "mint",
-     args: ["0x123..."],
-     contractAddress: "0x789...",
-     value: parseEther("0.1"),
- }
- ];
-
- // Method 1: Using mutateAsync (recommended for async/await)
- try {
- const hashes = await executeMultiContractTransaction.mutateAsync(transactions);
- console.log("Transactions successful:", hashes);
- } catch (error) {
- console.error("Transactions failed:", error);
- }
-
- // Method 2: Using mutate with callbacks
- executeMultiContractTransaction.mutate(transactions, {
- onSuccess: (hashes) => {
-     console.log("Transactions successful:", hashes);
-     // Additional success handling
- },
- onError: (error) => {
-     console.error("Transactions failed:", error);
-     // Additional error handling
- },
- onSettled: () => {
-     console.log("All transactions completed");
-     // Cleanup or final state updates
- }
- });
-
- // Method 3: Using with React Query's built-in states
- if (executeMultiContractTransaction.isPending) {
- return <div>Transactions pending...</div>;
- }
-
- if (executeMultiContractTransaction.isError) {
- return <div>Error: {executeMultiContractTransaction.error.message}</div>;
- }
-
- // Method 4: Using with transaction states
- useEffect(() => {
- Object.entries(transactionStates).forEach(([index, state]) => {
-     if (state.status === "success") {
-       console.log(`Transaction ${index} successful:`, state.hash);
-     } else if (state.status === "error") {
-       console.error(`Transaction ${index} failed:`, state.error);
-     }
- });
- }, [transactionStates]);
-
- // Reset states when needed
- const handleReset = () => {
- resetTransactionStates();
- // Additional reset logic
- };
- ```
  */
  ```
