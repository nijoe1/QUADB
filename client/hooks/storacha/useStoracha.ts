import { useMutation, useQuery } from "@tanstack/react-query";

import { useStorachaProvider } from "@/app/providers/StorachaProvider";
import { getFileMetadata } from "@/lib/ipfs";

import { folderToFormData, getFilecoinDeal, storachaUploadFile } from "./storacha";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: storachaUploadFile,
  });
};

export const storachaUploadFolder = async (files: string[] | File[] | Blob[]) => {
  const res = await fetch(`/api/storacha/directoryUpload`, {
    method: "POST",
    body: folderToFormData(files),
  });
  return (await res.json()).cid;
};

export const useUploadFolder = () => {
  return useMutation({
    mutationFn: storachaUploadFolder,
  });
};

export const useFilecoinDeal = () => {
  const { client } = useStorachaProvider();
  return useMutation({
    mutationKey: ["filecoin-deal"],
    mutationFn: (piece: string) => {
      if (!client) {
        throw new Error("Client not found");
      }
      return getFilecoinDeal(piece, client);
    },
  });
};

export const useFilecoinDealsForCid = (cid?: string) => {
  const { client } = useStorachaProvider();
  return useQuery({
    enabled: !!cid && !!client,
    queryKey: ["filecoin-deals-for-cid", cid],
    queryFn: async () => {
      if (!client || !cid) {
        throw new Error("Client not found");
      }
      const metadata = await getFileMetadata(cid);
      return getFilecoinDeal(metadata.pieceMetadata.piece, client);
    },
  });
};
