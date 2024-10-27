import lighthouse from "@lighthouse-web3/sdk";


export const uploadFiles = async (files: File[], apiKey: string) => {
  const output = await lighthouse.upload(files, apiKey);
  return output.data.Hash;
};

