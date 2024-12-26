"use client";
import { Benefits, HowItWorks, Hero } from "@/components/landing";
import { Container } from "@/components/ui/container";

export default function LandingPage() {
  return (
    <Container className="flex flex-col gap-10 md:gap-4">
      <Hero />
      <HowItWorks />
      <Benefits />
    </Container>
  );
}
