"use client";
import { Benefits, HowItWorks, Hero } from "@/components/landing";
import { Container } from "@/components/ui/container";
import Head from "next/head";

export default function LandingPage() {
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
        <Hero />
        <HowItWorks />
        <Benefits />
      </Container>
    </>
  );
}
