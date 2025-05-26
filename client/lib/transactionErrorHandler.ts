import {
  BaseError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  InsufficientFundsError,
  UserRejectedRequestError,
} from "viem";

export function handleTransactionError(error: BaseError): {
  title: string;
  description: string;
} {
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
      return {
        title: "Transaction Failed",
        description: revertReason,
      };
    }
    if (revertError instanceof UserRejectedRequestError) {
      return {
        title: "Transaction Failed",
        description: "User rejected the transaction",
      };
    }
    if (revertError instanceof ContractFunctionExecutionError) {
      const errorName = revertError.cause?.shortMessage ?? "";
      const revertReason = errorName;
      return {
        title: "Transaction Failed",
        description: revertReason,
      };
    }
    if (error instanceof InsufficientFundsError) {
      return {
        title: "Transaction Failed",
        description: "Insufficient funds",
      };
    }
    return {
      title: "Transaction Failed",
      description: "An unknown error occurred",
    };
  }
  return {
    title: "Transaction Failed",
    description: "An unknown error occurred",
  };
}
