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
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">
                Data Quests
              </h1>
              <p className="text-xl text-gray-600">
                Empowering dataset curators through stake-based verification
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <motion.div
                  animate={floatAnimation as any}
                  className="flex justify-center mb-6"
                >
                  <Database className="w-16 h-16 text-gray-700" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Dataset Curation
                </h2>
                <p className="text-gray-600">
                  Curators stake tokens on their datasets, demonstrating
                  confidence in data quality and commitment to maintenance.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <motion.div
                  animate={floatAnimation as any}
                  className="flex justify-center mb-6"
                >
                  <Shield className="w-16 h-16 text-gray-700" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Verification Process
                </h2>
                <p className="text-gray-600">
                  Data consumers verify dataset validity through a deterministic
                  and user-friendly verification system.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-lg mt-12"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Dispute Resolution Flow
              </h2>
              <div className="flex flex-wrap justify-around items-center gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <AlertTriangle className="w-12 h-12 text-gray-700 mb-4" />
                  <p className="text-sm font-medium text-gray-600">
                    Issue Detected
                  </p>
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gray-600 text-2xl"
                >
                  →
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <Scale className="w-12 h-12 text-gray-700 mb-4" />
                  <p className="text-sm font-medium text-gray-600">
                    Quest Initiated
                  </p>
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gray-600 text-2xl"
                >
                  →
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <CoinsIcon className="w-12 h-12 text-gray-700 mb-4" />
                  <p className="text-sm font-medium text-gray-600">
                    Stake Distribution
                  </p>
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gray-600 text-2xl"
                >
                  →
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-gray-700 mb-4" />
                  <p className="text-sm font-medium text-gray-600">
                    Resolution
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Tokenomics Highlights
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">
                    Curator Incentives
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Stake tokens to validate dataset quality</li>
                    <li>Earn rewards for maintaining accurate data</li>
                    <li>Higher stakes = Higher potential returns</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">
                    Verification Rewards
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
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
