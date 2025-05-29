import { useCallback, useMemo } from "react";

import { UseMutationResult } from "@tanstack/react-query";

import { ProgressModalProps } from "./ProgressModal";
import { ProgressStatus, Step } from "./types";

export type UseStepType = {
  functionStatus: {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    reset: () => void;
  };
  step: Omit<Step, "status">;
};

export type UseStepsProps = Record<string, UseStepType>;

export type UseProgressModalProps = {
  steps: UseStepType[];
  heading: string;
  subheading: string;
};

export const useSteps = (props: UseStepsProps): Step[] => {
  const steps = useMemo(() => {
    return Object.values(props).map((prop) => {
      return {
        ...prop.step,
        status: prop.functionStatus.isPending
          ? ProgressStatus.IN_PROGRESS
          : prop.functionStatus.isSuccess
            ? ProgressStatus.IS_SUCCESS
            : prop.functionStatus.isError
              ? ProgressStatus.IS_ERROR
              : ProgressStatus.NOT_STARTED,
      };
    });
  }, [props]);

  return steps;
};

export const useProgressModal = (props: UseProgressModalProps) => {
  const createProgressModalProps = (steps: Step[], isOpen: boolean): ProgressModalProps => {
    return {
      isOpen,
      heading: props.heading,
      subheading: props.subheading,
      steps,
    };
  };

  const steps = useSteps(
    props.steps.reduce((acc, step) => {
      acc[step.step.name] = {
        functionStatus: step.functionStatus,
        step: step.step,
      };
      return acc;
    }, {} as UseStepsProps),
  );

  const isOpen = useMemo(() => {
    return steps.some(
      (step) =>
        step.status === ProgressStatus.IN_PROGRESS || step.status === ProgressStatus.NOT_STARTED,
    );
  }, [steps]);

  const resetSteps = useCallback(() => {
    Object.values(props.steps).forEach((step) => {
      step.functionStatus.reset();
    });
  }, [steps]);

  return {
    progressModalProps: {
      ...createProgressModalProps(steps, isOpen),
    },
    resetSteps,
  };
};

export const extractFunctionFromMutation = (
  functionStatus: UseMutationResult<any, any, any, any>,
) => {
  return {
    isPending: functionStatus.isPending,
    isSuccess: functionStatus.isSuccess,
    isError: functionStatus.isError,
    reset: functionStatus.reset,
  };
};
