import NavbarLogo from "@/components/layout/NavbarLogo";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingAnimation = {
    y: [0, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const heartAnimation = {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex w-full grow items-center justify-center overflow-y-auto rounded-t-lg bg-black/80"
    >
      <motion.div
        variants={itemVariants}
        className="mx-auto px-4 py-12 md:px-24 lg:px-8"
      >
        <motion.div
          variants={footerVariants}
          className="flex flex-col items-center gap-5"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={floatingAnimation}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <NavbarLogo />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              whileHover={{ scale: 1.05, color: "#4f46e5" }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold uppercase tracking-tighter text-white"
            >
              QUADB
            </motion.h1>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                className="text-center text-white/90 transition-colors duration-200 hover:text-white"
                href="https://github.com/nijoe1/QUADB"
              >
                Fork me
              </Link>
            </motion.div>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-center text-lg text-white/90"
          >
            Build with{" "}
            <motion.span
              animate={heartAnimation}
              className="inline-block text-red-500"
            >
              ❤️
            </motion.span>{" "}
            for everyone from
            <motion.span
              whileHover={{ scale: 1.1, color: "#4f46e5" }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer font-bold"
            >
              {" Nick🇬🇷"}
            </motion.span>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
