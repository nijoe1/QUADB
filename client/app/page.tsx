import { Benefits, Hero, HowItWorks } from "@/components/landing";
import { Container } from "@/components/ui/container";

const LandingPage = () => {
  return (
    <Container className="flex flex-col gap-10 md:gap-4">
      <Hero />
      <HowItWorks />
      <Benefits />
    </Container>
  );
};

export default LandingPage;
