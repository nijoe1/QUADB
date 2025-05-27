import { useQuery } from "@tanstack/react-query";

export interface Proposal {
  id: string;
  instance_id: string;
  sequence: string;
  cid: string;
  proposal_description: string;
  created_at: string;
  signatures: {
    id: string;
    address: string;
    signature: string;
    created_at: string;
  }[];
}

export const useProposalsQuery = (instanceId: string, sequence: string) => {
  return useQuery({
    queryKey: ["proposals", instanceId, sequence],
    queryFn: async (): Promise<Proposal[]> => {
      if (!instanceId || !sequence) {
        return [];
      }

      try {
        const response = await fetch(
          `/api/signatures?instanceId=${instanceId}&sequence=${sequence}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch proposals");
        }

        const data = await response.json();
        return data.data as Proposal[];
      } catch (error) {
        console.error("Error fetching proposals:", error);
        throw error;
      }
    },
    enabled: !!instanceId && !!sequence,
  });
};
