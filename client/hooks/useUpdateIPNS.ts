import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renewIPNSName, uploadFile, UploadFileEncrypted } from "@/lib/IPFS";
import { useToast } from "@chakra-ui/react";

export const useUpdateIPNS = (
  address: any,
  IPNS: any,
  EncryptedKeyCID: any,
  isEncrypted: any,
  spaceID: any
) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const updateIPNS = async ({ file }: { file: File }) => {
    const key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);
    const jwt = localStorage.getItem(`lighthouse-jwt-${address}`);
    let cid: string;
    if (!isEncrypted) {
      cid = (await uploadFile(file, key)).Hash;
    } else {
      cid = await UploadFileEncrypted(file, key, address, jwt, spaceID);
    }
    await renewIPNSName(cid, IPNS, EncryptedKeyCID, address, jwt);
    return cid;
  };

  const mutation = useMutation<string, Error, { file: File }>({
    mutationFn: updateIPNS,
    onSuccess: () => {
      toast({
        title: "IPNS updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["ipns", address] });
    },
    onError: (error: any) => {
      console.error("Error updating IPNS:", error);
      toast({
        title: "Error updating IPNS",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return mutation;
};
