"use client";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Inter } from "next/font/google";
import { Toaster } from "@/ui-shadcn/toaster";
import { Web3Providers } from "@/app/providers";

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
          <Web3Providers>
            <Navbar />
            <main className="h-full min-h-svh grow">{children}</main>
            <div>
              <Footer />
            </div>
          </Web3Providers>
        </ChakraProvider>
        <Toaster />
      </body>
    </html>
  );
}
