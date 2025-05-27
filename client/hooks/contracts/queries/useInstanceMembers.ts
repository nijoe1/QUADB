import { useQuery } from "@tanstack/react-query";

import { getInstanceMembers } from "@/lib/tableland";

export const useInstanceMembers = (instanceID: string) => {
  return useQuery({
    queryKey: ["instanceMembers", instanceID],
    queryFn: () => getInstanceMembers(instanceID),
    enabled: !!instanceID,
  });
};

export default useInstanceMembers;
