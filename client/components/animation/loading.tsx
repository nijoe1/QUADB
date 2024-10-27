import React, { useEffect, useState } from "react";
import CoolLoading from "./cool.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
export default function Loading() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  if (!isBrowser) return null;

  return (
    <div>
      <div className="md:rounded-tl-[80px]">
        <Lottie animationData={CoolLoading} />
      </div>
    </div>
  );
}
