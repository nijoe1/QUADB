"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import * as Client from "@web3-storage/w3up-client";
import { useAccount } from "wagmi";

import { useGetClient } from "./utils/client";

interface StorachaContextType {
  client: Client.Client | undefined;
  account: string | undefined;
}

export const StorachaContext = createContext<StorachaContextType>({
  client: undefined,
  account: undefined,
});

export const useStorachaProvider = () => {
  const context = useContext(StorachaContext);
  if (!context) {
    throw new Error("useStoracha must be used within a StorachaProvider");
  }
  return context;
};

export const StorachaProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [context, setContext] = useState<StorachaContextType>({
    client: undefined,
    account: undefined,
  });

  const getClientMutation = useGetClient();

  useEffect(() => {
    if (address && !context.client) {
      getClientMutation.mutate(address, {
        onSuccess: (data) => {
          if (data) {
            setContext({
              client: data.client,
              account: address,
            });
            console.log(data.client);
          }
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  }, [address, context]);

  return <StorachaContext.Provider value={context}>{children}</StorachaContext.Provider>;
};
