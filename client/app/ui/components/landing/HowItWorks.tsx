import { motion } from "framer-motion";

export interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
      </svg>
    ),
    title: "Create subspaces",
    description:
      "Create Database Subspaces to host your Instances and Enhanced exploring experience using the ENSprotocol.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M16 15h5v7l-2.5 -1.5l-2.5 1.5z" />
        <path d="M20 11l-8 -8l-9 9h2v7a2 2 0 0 0 2 2h5" />
        <path d="M9 21v-6a2 2 0 0 1 2 -2h1.5" />
      </svg>
    ),
    title: "Create dataset instances under your subspace field",
    description:
      "Host your datasets and AI models in a secure and decentralized way using the Filecoin Virtual Machine",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
        <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M17 10h2a2 2 0 0 1 2 2v1" />
        <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
      </svg>
    ),
    title: "Manage access control",
    description:
      "Configure your instace from public - private - group-private - sell it to AI bots using subscriptions and supercharge your data monetization strategy.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
        <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
        <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
        <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
        <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
      </svg>
    ),
    title: "Collaborate with your team",
    description:
      "Invite your team members to collaborate on your datasets and AI models and share the revenue generated from your datasets. Powered by the Push protocol.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
        <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
        <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
        <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
        <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
        <path d="M9 12l2 2l4 -4" />
      </svg>
    ),
    title: "Update your datasets and AI models",
    description:
      "Using token gated access to IPNS private keys, dynamic updates to your datasets and AI models are now possible. Powered by the Lighthouse protocol.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 12l6 -9l6 9l-6 9z" />
        <path d="M6 12l6 -3l6 3l-6 2z" />
      </svg>
    ),
    title: "Get paid for engaging with QUADB",
    description:
      "Earn QUADB tokens for engaging with the QUADB ecosystem and use them to pay for services or exchange them for other cryptocurrencies.",
  },
];
export function HowItWorks(): JSX.Element {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="py-10"
      id="how-it-works"
    >
      <motion.header variants={headerVariants} className="my-5 text-center font-bold">
        <motion.p variants={headerVariants} className="text-lg text-muted-foreground/60">
          How it works
        </motion.p>
        <motion.h1 variants={headerVariants} className="text-4xl font-extrabold text-grey-600">
          Step-by-step guide
        </motion.h1>
      </motion.header>
      <motion.div variants={containerVariants} className="mx-auto grid max-w-[900px]">
        {steps.map((step, index) => (
          <motion.div key={index} variants={stepVariants}>
            <StepElement step={step} index={index} isLast={index === steps.length - 1} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function StepElement({
  step,
  index,
  isLast,
}: {
  step: any;
  index: number;
  isLast?: boolean;
}): JSX.Element {
  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1,
      },
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="flex">
      <div className="mr-6 flex flex-col items-center">
        {index === 0 && <div className="h-10 w-px opacity-0 sm:h-full" />}
        {index > 0 && !isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "30px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="w-px bg-grey-300 sm:h-1/2"
          />
        )}
        {isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "30px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="w-px bg-grey-300 sm:h-1/3"
          />
        )}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            animate={pulseAnimation}
            className="flex size-8 items-center justify-center rounded-full border text-xs font-medium"
          >
            {index + 1}
          </motion.div>
        </motion.div>
        {index === 0 ? (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-px bg-grey-300"
          />
        ) : (
          !isLast && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "80%" }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              className="w-px bg-grey-300 sm:h-1/2"
            />
          )
        )}
      </div>
      <motion.div
        whileHover={{ x: 10 }}
        transition={{ duration: 0.2 }}
        className="show flex flex-col pb-6 sm:flex-row sm:items-center sm:pb-0"
      >
        <div className="sm:mr-5">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="my-3 flex size-16 items-center justify-center rounded-full bg-indigo-50 sm:size-24"
          >
            {step?.icon}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          viewport={{ once: true }}
        >
          <motion.h1
            whileHover={{ color: "#4f46e5" }}
            transition={{ duration: 0.2 }}
            className="text-xl font-bold text-grey-600 sm:text-base"
          >
            {step?.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            viewport={{ once: true }}
            className="pr-2 text-sm text-grey-700"
          >
            {step?.description}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
