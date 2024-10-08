"use client";
import { Benefits, Hero, HowItWorks } from "@/app/components/landing";
import { Container } from "@/app/components/ui/container";
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
