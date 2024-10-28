import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renewIPNSName, createIPNSName } from "@/lib/ipfs";
import { useToast } from "@chakra-ui/react";
import { useWalletClient } from "wagmi";
import { uploadFiles, uploadFilesEncrypted } from ".";
import { getUserAPIKey, getUserJWT, getViewConditions } from "./utils";
import { Address, Hex } from "viem";
import { QUADB } from "@/constants/contracts";

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
  let cid: string;
  let jwt: string;
  let apiKey: string;
  const updateIPNS = async ({ file }: { file: File }) => {
    if (!walletClient || !address) {
      throw new Error("Wallet client not found");
    }
    if (!isEncrypted) {
      cid = (await uploadFiles(
        [file],
        await getUserAPIKey(address, walletClient)
      )) as string;
    } else {
      const viewAccessControlConditions = getViewConditions({
        contractAddress: QUADB,
        chainID: 314,
        instanceID: spaceID,
      });
      jwt = (await getUserJWT(address, walletClient)) as string;
      apiKey = await getUserAPIKey(address, walletClient);
      cid = await uploadFilesEncrypted({
        files: [file],
        userAddress: address,
        apiKey,
        jwt,
        conditions: viewAccessControlConditions.conditions,
        aggregator: viewAccessControlConditions.aggregator,
      });
    }
    if (!jwt) {
      jwt = (await getUserJWT(address, walletClient)) as string;
    }
    await renewIPNSName({
      IPNS,
      EncryptedKeyCID,
      cid: cid,
      address: address,
      jwt: jwt,
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
  const { data: walletClient } = useWalletClient();

  const createIPNS = async ({
    file,
    address,
    spaceID,
    isEncrypted,
  }: {
    file: File;
    address: Address;
    spaceID: Hex;
    isEncrypted: boolean;
  }) => {
    let cid: string | null = null;
    let jwt: string;
    let apiKey: string;
    if (!walletClient || !address) {
      throw new Error("Wallet client not found");
    }
    if (!isEncrypted) {
      cid = await uploadFiles(
        [file],
        await getUserAPIKey(address, walletClient)
      );
    } else {
      const viewAccessControlConditions = getViewConditions({
        contractAddress: QUADB,
        chainID: 314,
        instanceID: spaceID,
      });
      jwt = (await getUserJWT(address, walletClient)) as string;
      apiKey = await getUserAPIKey(address, walletClient);
      cid = await uploadFilesEncrypted({
        files: [file],
        userAddress: address,
        apiKey,
        jwt,
        conditions: viewAccessControlConditions.conditions,
        aggregator: viewAccessControlConditions.aggregator,
      });
    }
    return await createIPNSName({
      file: file,
      spaceID: spaceID,
      isEncrypted: isEncrypted,
      address: address,
      walletClient: walletClient,
    });
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
