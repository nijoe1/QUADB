"use client";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/app/components/menu/Navbar";
import Footer from "@/app/components/menu/Footer";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import {
  darkTheme,
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { Inter } from "next/font/google";

const _filecoin = {
  ...filecoin,

  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmXQMtADMsCqsYEvyuEA3PkFq2xtWAQetQFtkybjEXvk3Z",
};

const _filecoinCalibration = {
  ...filecoinCalibration,

  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmXQMtADMsCqsYEvyuEA3PkFq2xtWAQetQFtkybjEXvk3Z",
};

const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "ad9d4173328447d73a95b113fec565eb",
  chains: [_filecoin, _filecoinCalibration],
  transports: {
    [_filecoin.id]: http(),
    [_filecoinCalibration.id]: http(),
  },
});

const queryClient = new QueryClient();

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
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
                <Navbar />
                <main>{children}</main>
                <Footer />
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
