import { showToast } from "./toast";
import {
  BaseError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  InsufficientFundsError,
  UserRejectedRequestError,
} from "viem";

export function handleTransactionError(error: BaseError) {
  if (error instanceof BaseError) {
    const revertError = error.walk(
      (err) =>
        err instanceof ContractFunctionRevertedError ||
        err instanceof UserRejectedRequestError ||
        err instanceof ContractFunctionExecutionError ||
        err instanceof InsufficientFundsError
    );
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? "";
      const revertReason =
        revertError.message
          .split("reverted with the following reason:")[1]
          ?.trim() ?? errorName;
      showToast.error("Transaction Failed", revertReason);
      return;
    }
    if (revertError instanceof UserRejectedRequestError) {
      showToast.error("Transaction Failed", "User rejected the transaction");
      return;
    }
    if (revertError instanceof ContractFunctionExecutionError) {
      const errorName = revertError.cause?.shortMessage ?? "";
      const revertReason = errorName;
      showToast.error("Transaction Failed", revertReason);
      console.error(revertError);
      return;
    }
    if (error instanceof InsufficientFundsError) {
      showToast.error("Transaction Failed", "Insufficient funds");
    }
    showToast.error("Transaction Failed", "An unknown error occurred");
  }
  return;
}
