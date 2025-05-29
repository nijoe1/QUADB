"use client";

import React, { useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";

import NavLinks, { NavLinksResponsive } from "@/components/layout/NavLinks";
import Logo from "@/components/layout/NavbarLogo";
import { Container } from "@/ui-shadcn/container";

export default function Navbar(): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const sidebarVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <Container className="mt-4 rounded-md bg-black/80">
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`relative mx-auto flex w-full md:justify-between lg:grid lg:grid-cols-3 lg:px-3`}
      >
        <motion.div
          variants={itemVariants}
          className="absolute inset-y-0 flex items-center md:static"
        >
          <div className="lg:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 text-grey-500"
              onClick={toggleSidebar}
            >
              <motion.svg
                animate={{ rotate: isSidebarOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="#f0f0f0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6l16 0" />
                <path d="M4 12l16 0" />
                <path d="M4 18l16 0" />
              </motion.svg>
            </motion.button>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <NavLinksResponsive
                    isConnected={true}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block"
          >
            <Logo />
          </motion.div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="flex grow justify-center md:hidden"
        >
          <Logo />
        </motion.div>
        <motion.div variants={itemVariants} className="flex justify-center">
          <NavLinks />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="hidden items-center justify-end gap-2 md:flex"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ConnectButton showBalance={true} chainStatus={"icon"} />
          </motion.div>
        </motion.div>
      </motion.nav>
    </Container>
  );
}
