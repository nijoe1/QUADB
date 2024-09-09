"use client";
import { Benefits, Hero, HowItWorks } from "@/components/Landing";
import { Container } from "@/components/UI/container";
import { useEffect } from "react";

export default function LandingPage(): JSX.Element {
  useEffect(() => {});
  return (
    <Container className="flex flex-col gap-10 md:gap-4">
      <Hero />
      <HowItWorks />
      <Benefits />
    </Container>
  );
}
