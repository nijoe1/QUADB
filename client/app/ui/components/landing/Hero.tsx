"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import HeroAnimation from "@/components/animation/HeroAnimation";
import { Button } from "@/primitives/Button";

export function Hero(): JSX.Element {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const sponsorVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 1.2,
        staggerChildren: 0.1,
      },
    },
  };

  const sponsorItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <section className="mt-5 overflow-hidden py-10">
        <div className="mx-auto items-center justify-between gap-x-5 text-grey-600 md:flex md:px-4">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl"
          >
            <motion.h1
              variants={textVariants}
              className="text-4xl font-extrabold text-primary md:text-5xl"
            >
              QUADB the unified namespace of datasets and AI models
            </motion.h1>
            <motion.p variants={textVariants}>
              Creating the new era of storing datasets and perform transparent computations on top
              of them using the Filecoin Virtual Machine
            </motion.p>
            <motion.div
              variants={textVariants}
              className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/spaces" className="group flex items-center justify-center gap-x-2">
                  Discover
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={"outlined-primary"}
                  onClick={(e: any) => {
                    e.preventDefault();
                    scrollToSection("how-it-works");
                  }}
                  value="Learn more"
                  className="border-primary text-primary hover:border-primary/80 hover:bg-white hover:text-primary/80"
                />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="mt-14 flex-none md:mt-0 md:max-w-lg"
          >
            <motion.div animate={floatingAnimation}>
              {typeof document != undefined && <HeroAnimation />}
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          variants={sponsorVariants}
          initial="hidden"
          animate="visible"
          className="rounded-lg bg-black/80"
        >
          <div className="mx-auto mt-20 flex w-3/4 flex-col items-center px-4 pb-4 md:px-8">
            <motion.p
              variants={sponsorItemVariants}
              className="my-5 rounded-lg border bg-white p-2 text-center text-lg font-bold text-black"
            >
              Powered By
            </motion.p>
            <div className="w-full">
              <motion.ul
                variants={sponsorVariants}
                className="flex flex-wrap items-center justify-center gap-4 lg:justify-between"
              >
                <motion.li
                  variants={sponsorItemVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="/images/storacha.png"
                    alt="storacha"
                    className="h-[60px] scale-90 rounded-full"
                  />
                </motion.li>
                <motion.li
                  variants={sponsorItemVariants}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src="/images/filecoin.png" alt="filecoin" className="h-[65px] scale-90" />
                </motion.li>
                <motion.li
                  variants={sponsorItemVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src="/images/fns.jpg" alt="fns" className="h-[65px] scale-90 rounded-md" />
                </motion.li>
                <motion.li
                  variants={sponsorItemVariants}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src="/images/tableland.png" alt="tableland" className="h-[60px] scale-90" />
                </motion.li>
                <motion.li
                  variants={sponsorItemVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="/images/lit-logo.jpeg"
                    alt="lit"
                    className="h-[40px] rounded-full"
                  />
                </motion.li>
              </motion.ul>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
