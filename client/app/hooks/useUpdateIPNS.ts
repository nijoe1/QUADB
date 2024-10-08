import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  renewIPNSName,
  storachaUpload,
  UploadFileEncrypted,
} from "@/app/lib/ipfs";
import { useToast } from "@chakra-ui/react";

export const useUpdateIPNS = (
  address: any,
  IPNS: string,
  EncryptedKeyCID: string,
  isEncrypted: boolean,
  spaceID: string
) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const updateIPNS = async ({ file }: { file: File }) => {
    let cid: string;
    if (!isEncrypted) {
      cid = await storachaUpload(file);
    } else {
      cid = await UploadFileEncrypted({ file, spaceID, chain: "sepolia" });
    }
    await renewIPNSName({
      IPNS,
      EncryptedKeyCID,
      cid: cid,
      chain: "sepolia",
    });
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
