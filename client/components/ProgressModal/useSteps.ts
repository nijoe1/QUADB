import { UseMutationResult } from "@tanstack/react-query";
import { ProgressStatus, Step } from "./types";
import { useMemo } from "react";

export type UseStepsProps = Record<string, {
    mutation: UseMutationResult<any, any, any>;
    step: Step;
  }>;

export const useSteps = (props: UseStepsProps) => {
  const steps = useMemo(() => {
    return Object.values(props).map((prop) => {
      return {
        ...prop.step,
        status: prop.mutation.isPending
          ? ProgressStatus.IN_PROGRESS
          : prop.mutation.isSuccess
            ? ProgressStatus.IS_SUCCESS
            : prop.mutation.isError
              ? ProgressStatus.IS_ERROR
              : ProgressStatus.NOT_STARTED,
      };
    });
  }, [props]);

  return { steps };
};
