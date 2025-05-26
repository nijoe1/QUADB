import { fetchIPFS } from "@/lib/ipfs";
import { toast } from "@/hooks/useToast";
import { Address, WalletClient } from "viem";
import { storachaUploadFile } from "@/hooks/storacha";
import * as W3Name from "w3name";
import { useMutation } from "@tanstack/react-query";

interface updateCodeBody {
  signature: string;
  newCid: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  codeID: string;
  codeHash: string;
}

interface IPNSConfig {
  codeID: string;
  ipns: string;
  ciphertext: string;
  dataToEncryptHash: string;
  codeCID: string;
}
const handleSignUpdateCode = async ({
  walletClient,
  address,
  file,
  IPNS,
}: {
  walletClient: WalletClient;
  address: string;
  file: File;
  IPNS: string;
}) => {
  if (!walletClient || !address || !file) {
    toast({
      title: "Error",
      description: "Please connect your wallet and select a file",
      variant: "destructive",
    });
    return;
  }

  try {
    const cid = await storachaUploadFile(file);

    const name = W3Name.parse(IPNS);
    const revision = await W3Name.resolve(name);
    const sequence = revision.sequence.toString();

    const signature = await walletClient.signMessage({
      account: address as Address,
      message: `I acknowledge updating the current ipns record : ${IPNS} contents to point to this new ipfs cid : ${cid} and the previous sequence number is ${sequence}`,
    });

    toast({
      title: "Proposal created successfully",
      variant: "default",
    });
    return { signature, cid, IPNS, sequence };
  } catch (error) {
    console.error("Error creating proposal:", error);
    toast({
      title: "Error creating proposal",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
  }
};
const handleUpdateCode = async ({
  walletClient,
  address,
  file,
  IPNS,
}: {
  walletClient: WalletClient;
  address: string;
  file: File;
  IPNS: string;
}) => {
  if (!walletClient || !address) return;

  try {
    const response = await handleSignUpdateCode({
      walletClient,
      address,
      file,
      IPNS,
    });

    if (!response) throw new Error("Failed to sign update code");

    const ipnsConfig = (await fetchIPFS(response.cid)) as IPNSConfig;

    const body: updateCodeBody = {
      signature: response.signature,
      newCid: response.cid,
      ipns: ipnsConfig.ipns,
      ciphertext: ipnsConfig.ciphertext,
      dataToEncryptHash: ipnsConfig.dataToEncryptHash,
      codeID: ipnsConfig.codeID,
      codeHash: ipnsConfig.codeCID,
    };
    const res = await fetch("/api/lit/update-ipns-action/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = (await res.json()) as {
      success: boolean;
    };

    if (!data.success) {
      throw new Error("Failed to update IPNS");
    }

    toast({
      title: "IPNS updated successfully",
      variant: "default",
    });
  } catch (error) {
    console.error("Error updating IPNS:", error);
    toast({
      title: "Error updating IPNS",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
  }
};

export const useUpdateCode = () => {
  return useMutation({
    mutationFn: handleUpdateCode,
  });
};
