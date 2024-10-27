import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import databases from "./databases.json"; // Assuming databases is the animation data

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function HeroAnimation() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  if (!isBrowser) return null;

  return (
    <div>
      <div className="md:rounded-tl-[80px]">
        <Lottie animationData={databases} />
      </div>
    </div>
  );
}
