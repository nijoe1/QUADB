"use client";
import { Benefits, HowItWorks, Hero } from "@/components/landing";
import { Container } from "@/ui-shadcn/container";
import Head from "next/head";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <>
      <Head>
        <title>QUADB</title>
        <meta
          name="description"
          content="QUADB the unified namespace of datasets and AI models
          Creating the new era of storing datasets and perform transparent computations on top of them using the Filecoin Virtual Machine"
        />
        <meta name="image" content="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="QUADB" />
        <meta
          property="og:description"
          content="QUADB the unified namespace of datasets and AI models
          Creating the new era of storing datasets and perform transparent computations on top of them using the Filecoin Virtual Machine"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QUADB" />
        <meta
          name="twitter:description"
          content="QUADB the unified namespace of datasets and AI models
          Creating the new era of storing datasets and perform transparent computations on top of them using the Filecoin Virtual Machine"
        />
      </Head>
      <Container className="flex flex-col gap-10 md:gap-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-10 md:gap-4"
        >
          <motion.div variants={itemVariants}>
            <Hero />
          </motion.div>
          <motion.div variants={itemVariants}>
            <HowItWorks />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Benefits />
          </motion.div>
        </motion.div>
      </Container>
    </>
  );
}
