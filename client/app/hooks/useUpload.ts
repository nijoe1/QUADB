import { createIPNSName, storachaUpload } from "@/app/lib/ipfs"; // Assume these functions exist
import { useMutation } from "@tanstack/react-query";

export const useUpload = () => {
  const upload = useMutation({
    mutationFn: async (file: File) => {
      return await storachaUpload(file);
    },
  });

  return upload;
};
