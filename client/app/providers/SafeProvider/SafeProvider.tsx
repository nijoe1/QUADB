import React, { useEffect } from "react";

import { SafeProvider as SafeProviderSDK } from "@safe-global/safe-apps-react-sdk";
import { useAccount, useConnect } from "wagmi";

const AUTOCONNECTED_CONNECTOR_IDS = ["safe"];

export const SafeProvider = ({ children }: { children: React.ReactNode }) => {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  useEffect(() => {
    AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
      const connectorInstance = connectors.find((c) => c.id === connector);
      const isIframe = window.top !== window.self;
      if (connectorInstance && isIframe) {
        connect({ connector: connectorInstance });
      }
    });
  }, [connect, connectors, address]);
  return <SafeProviderSDK>{children}</SafeProviderSDK>;
};
