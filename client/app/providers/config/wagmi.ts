import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createClient, fallback, http } from "viem";
import * as chains from "viem/chains";
import { createConfig } from "wagmi";

const wallets = [
  metaMaskWallet,
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets,
    },
  ],

  {
    appName: "Safe App Example",
    projectId: "42a4d689485d5a324116e53ed077d907",
  },
);

const _filecoin = {
  ...chains.filecoin,

  iconUrl: "https://gateway.lighthouse.storage/ipfs/QmXQMtADMsCqsYEvyuEA3PkFq2xtWAQetQFtkybjEXvk3Z",
};

const _filecoinCalibration = {
  ...chains.filecoinCalibration,

  iconUrl: "https://gateway.lighthouse.storage/ipfs/QmXQMtADMsCqsYEvyuEA3PkFq2xtWAQetQFtkybjEXvk3Z",
};

export const config = createConfig({
  chains: [_filecoin, _filecoinCalibration],
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    const rpcFallbacks = [http()];

    return createClient({
      chain,
      transport: fallback(rpcFallbacks),
      pollingInterval: 10000,
    });
  },
});
