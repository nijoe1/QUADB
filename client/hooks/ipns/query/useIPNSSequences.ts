import { useQuery } from "@tanstack/react-query";
import * as W3Name from "w3name";

import { useToast } from "@/hooks/useToast";

interface SequenceData {
  currentSequence: string;
  historicalSequences: string[];
}

export const useIPNSSequences = (IPNS: string, spaceID: string, threshold: number) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["ipns-sequences", IPNS, spaceID, threshold],
    queryFn: async (): Promise<SequenceData> => {
      try {
        const name = await W3Name.parse(IPNS);
        const revision = await W3Name.resolve(name);
        const currentSequence = revision.sequence.toString();

        const response = await fetch(`/api/signatures/history?instanceId=${spaceID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sequences = data.data
          .filter((p: any) => p.signatures.length >= threshold)
          .map((p: any) => p.sequence);

        return {
          currentSequence,
          historicalSequences: [...sequences],
        };
      } catch (error) {
        console.error("Error fetching sequences:", error);
        toast({
          title: "Error fetching sequences",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!IPNS && !!spaceID,
  });
};
