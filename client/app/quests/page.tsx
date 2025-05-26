"use client";

import { Container } from "@/ui-shadcn/container";
import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Database,
  CoinsIcon,
  Scale,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function DataQuests() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const floatAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };
  return (
    <Container className="my-5 rounded-xl bg-[#424242] py-5">
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl p-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="mb-16 text-center">
              <h1 className="mb-6 text-4xl font-bold text-white">
                Data Quests
              </h1>
              <p className="text-xl text-white">
                Empowering dataset curators through stake-based verification
              </p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-2">
              <motion.div
                variants={itemVariants}
                className="rounded-xl bg-white p-8 shadow-lg"
              >
                <motion.div
                  animate={floatAnimation as any}
                  className="mb-6 flex justify-center"
                >
                  <Database className="h-16 w-16 text-grey-700" />
                </motion.div>
                <h2 className="mb-4 text-2xl font-bold text-grey-800">
                  Dataset Curation
                </h2>
                <p className="text-grey-600">
                  Curators stake tokens on their datasets, demonstrating
                  confidence in data quality and commitment to maintenance.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-xl bg-white p-8 shadow-lg"
              >
                <motion.div
                  animate={floatAnimation as any}
                  className="mb-6 flex justify-center"
                >
                  <Shield className="h-16 w-16 text-grey-700" />
                </motion.div>
                <h2 className="mb-4 text-2xl font-bold text-grey-800">
                  Verification Process
                </h2>
                <p className="text-grey-600">
                  Data consumers verify dataset validity through a deterministic
                  and user-friendly verification system.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mt-12 rounded-xl bg-white p-8 shadow-lg"
            >
              <h2 className="mb-6 text-2xl font-bold text-grey-800">
                Dispute Resolution Flow
              </h2>
              <div className="flex flex-wrap items-center justify-around gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <AlertTriangle className="mb-4 h-12 w-12 text-grey-700" />
                  <p className="text-sm font-medium text-grey-600">
                    Issue Detected
                  </p>
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl text-grey-600"
                >
                  →
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <Scale className="mb-4 h-12 w-12 text-grey-700" />
                  <p className="text-sm font-medium text-grey-600">
                    Quest Initiated
                  </p>
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl text-grey-600"
                >
                  →
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <CoinsIcon className="mb-4 h-12 w-12 text-grey-700" />
                  <p className="text-sm font-medium text-grey-600">
                    Stake Distribution
                  </p>
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl text-grey-600"
                >
                  →
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <CheckCircle2 className="mb-4 h-12 w-12 text-grey-700" />
                  <p className="text-sm font-medium text-grey-600">
                    Resolution
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-xl bg-gradient-to-r from-grey-50 to-grey-100 p-8 shadow-xl"
            >
              <h2 className="mb-6 text-2xl font-bold text-grey-800">
                Tokenomics Highlights
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold text-grey-700">
                    Curator Incentives
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-grey-600">
                    <li>Stake tokens to validate dataset quality</li>
                    <li>Earn rewards for maintaining accurate data</li>
                    <li>Higher stakes = Higher potential returns</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-grey-700">
                    Verification Rewards
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-grey-600">
                    <li>Earn tokens for successful data verification</li>
                    <li>Penalties for false disputes</li>
                    <li>Community-driven quality control</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
