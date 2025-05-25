"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import SafeProvider from "@safe-global/safe-apps-react-sdk";
import { SafeAutoConnect } from "@/app/providers/SafeAutoConnect";

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#424242",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
          modalSize="compact"
        >
          <SafeProvider>
            <SafeAutoConnect>{children}</SafeAutoConnect>
          </SafeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
