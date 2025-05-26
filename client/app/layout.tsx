"use client";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Inter } from "next/font/google";
import { Toaster } from "@/ui-shadcn/toaster";
import { Web3Providers } from "@/app/providers";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layoutVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const mainVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Providers>
          <motion.div
            variants={layoutVariants}
            initial="hidden"
            animate="visible"
            className="flex min-h-screen flex-col"
          >
            <Navbar />
            <motion.main
              variants={mainVariants}
              className="h-full min-h-svh grow"
            >
              {children}
            </motion.main>
            <motion.div variants={mainVariants}>
              <Footer />
            </motion.div>
          </motion.div>
        </Web3Providers>
        <Toaster />
      </body>
    </html>
  );
}
