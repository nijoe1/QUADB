"use client";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@chakra-ui/icons";
import HeroAnimation from "@/components/animation/HeroAnimation";
import Link from "next/link";

export function Hero(): JSX.Element {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="mt-5 overflow-hidden  py-10">
        <div className="overflow mx-auto items-center justify-between gap-x-5 text-gray-600 md:flex md:px-4">
          <div className="motion-safe:animate-hero-text-sm md:motion-safe:animate-hero-text flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
            <h1 className="text-primary text-4xl font-extrabold md:text-5xl">
              QUADB the unified namespace of datasets and AI models
            </h1>
            <p>
              Creating the new era of storing datasets and perform transparent
              computations on top of them using the Filecoin Virtual Machine
            </p>
            <div className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <Link
                href="/spaces"
                className="group flex items-center justify-center gap-x-2"
              >
                Discover
                <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
              </Link>
              <Button
                variant={"outline"}
                onClick={(e: any) => {
                  e.preventDefault();
                  scrollToSection("how-it-works");
                }}
                className="text-primary border-primary hover:text-primary/80 hover:border-primary/80 hover:bg-white"
              >
                Learn more
              </Button>
            </div>
          </div>
          <div className="motion-safe:animate-hero-image-sm md:motion-safe:animate-hero-image mt-14 flex-none md:mt-0 md:max-w-lg">
            {typeof document != undefined && <HeroAnimation />}
          </div>
        </div>
        <div className="rounded-lg bg-black/80">
          <div className="md:motion-safe:animate-sponsors mx-auto mt-20 flex w-3/4 flex-col items-center px-4 pb-4 md:px-8">
            <p className="border-gray my-5 rounded-lg bg-white p-2 text-center text-lg font-bold text-black">
              Powered By
            </p>
            <div className="w-full">
              <ul className="flex flex-wrap items-center justify-center gap-4 lg:justify-between">
                <li>
                  <img
                    src="/images/storacha.png"
                    alt="storacha"
                    className="h-[60px] scale-90 rounded-full"
                  />
                </li>
                <li>
                  <img
                    src="/images/filecoin.png"
                    alt="filecoin"
                    className="h-[65px]  scale-90"
                  />
                </li>
                <li>
                  <img
                    src="/images/fns.jpg"
                    alt="fns"
                    className="h-[65px]  scale-90 rounded-md"
                  />
                </li>
                <li>
                  <img
                    src="/images/tableland.png"
                    alt="tableland"
                    className="h-[60px]  scale-90"
                  />
                </li>
                <li>
                  <img
                    src="/images/lighthouse-storage.png"
                    alt="lit"
                    className="h-[60px] rounded-full"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
