import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renewIPNSName, UploadFileEncrypted } from "@/lib/ipfs";
import { useToast } from "@chakra-ui/react";
import { useWalletClient } from "wagmi";
import { uploadFiles } from "./lighthouse";
import { getUserAPIKey } from "./lighthouse/utils";
import { Address } from "viem";
export const useUpdateIPNS = (
  address: any,
  IPNS: string,
  EncryptedKeyCID: string,
  isEncrypted: boolean,
  spaceID: string
) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();

  const updateIPNS = async ({ file }: { file: File }) => {
    let cid: string;
    if (!walletClient || !address) {
      throw new Error("Wallet client not found");
    }
    // if (!isEncrypted) {
      cid = await uploadFiles(
        [file],
        await getUserAPIKey(address, walletClient)
      );
    // } else {
    //   cid = await UploadFileEncrypted({
    //     file,
    //     spaceID,
    //     chain: "filecoin",
    //     walletClient,
    //     address,
    //   });
    // }
    await renewIPNSName({
      IPNS,
      EncryptedKeyCID,
      cid: cid,
      chain: "filecoin",
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

export const useCreateIPNS = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();

  const createIPNS = async ({
    file,
    address,
    spaceID,
    isEncrypted,
  }: {
    file: File;
    address: Address;
    spaceID: string;
    isEncrypted: boolean;
  }) => {
    let cid: string;
    if (!walletClient || !address) {
      throw new Error("Wallet client not found");
    }
    if (!isEncrypted) {
      cid = await uploadFiles(
        [file],
        await getUserAPIKey(address, walletClient)
      );
    } else {
      cid = await UploadFileEncrypted({
        file,
        spaceID,
        chain: "filecoin",
        walletClient,
        address,
      });
    }
    return cid;
  };

  const mutation = useMutation({
    mutationFn: createIPNS,
    onSuccess: () => {
      toast({
        title: "IPNS created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      console.error("Error creating IPNS:", error);
      toast({
        title: "Error creating IPNS",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return mutation;
};
