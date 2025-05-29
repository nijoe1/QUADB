import * as Client from "@web3-storage/w3up-client";
import * as Link from "multiformats/link";

export const fileToFormData = (data: string | File | Blob) => {
  const formData = new FormData();

  if (!(data instanceof File)) {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    data = new File([blob], "metadata.json");
  }

  formData.append("file", data);
  return formData;
};

export const folderToFormData = (files: string[] | File[] | Blob[]): FormData => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(`files[]`, file); // Ensure files are appended as an array
  });
  return formData;
};

export const storachaUploadFile = async (file: string | File | Blob) => {
  const res = await fetch(`/api/storacha/fileUpload`, {
    method: "POST",
    body: fileToFormData(file),
  });
  return (await res.json()).cid;
};
export const getFilecoinDeal = async (piece: string, client: Client.Client) => {
  const deals = [];
  const result = await client.capability.filecoin.info(Link.parse(piece));
  if (result.out.ok) {
    for (const { provider, aux } of result.out.ok.deals) {
      deals.push({
        provider,
        dealID: aux.dataSource.dealID,
      });
    }
  }

  return deals;
};
