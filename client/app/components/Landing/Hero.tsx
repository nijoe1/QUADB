"use client";
import { Button } from "@/app/components/ui/Button";
import { ArrowRightIcon } from "@chakra-ui/icons";
import HeroAnimation from "@/app/components/animation/HeroAnimation";
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
      <section className="py-10 mt-5  overflow-hidden">
        <div className="mx-auto text-gray-600 gap-x-5 items-center justify-between overflow md:flex md:px-4">
          <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl motion-safe:animate-hero-text-sm md:motion-safe:animate-hero-text">
            <h1 className="text-4xl text-primary font-extrabold md:text-5xl">
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
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how-it-works");
                }}
                className="text-primary hover:bg-white border-primary hover:text-primary/80 hover:border-primary/80"
              >
                Learn more
              </Button>
            </div>
          </div>
          <div className="flex-none mt-14 md:mt-0 md:max-w-lg motion-safe:animate-hero-image-sm md:motion-safe:animate-hero-image">
            {typeof document != undefined && <HeroAnimation />}
          </div>
        </div>
        <div className="bg-black/80 rounded-lg">
          <div className="mt-20 px-4 pb-4 mx-auto md:px-8 md:motion-safe:animate-sponsors flex flex-col items-center w-3/4">
            <p className="text-center text-lg my-5 text-black bg-white p-2 border-gray rounded-lg font-bold">
              Powered By
            </p>
            <div className="w-full">
              <ul className="flex items-center flex-wrap justify-center lg:justify-between gap-4">
                <li>
                  <img
                    src="/images/storacha.png"
                    alt="storacha"
                    className="h-[60px] rounded-full scale-90"
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
                    src="/images/lit-logo.jpeg"
                    alt="lit"
                    className="h-[60px] rounded-full"
                  />
                </li>

                {/* <li>
                  <img
                    src="/images/worldcoin.jpeg"
                    alt="push"
                    className="h-[65px]  scale-90 rounded-md"
                  />
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
