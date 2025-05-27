import { useEffect } from "react";
import { useWindowSize } from "react-use";

export const useWindowDimensions = (
  setWindowDimensions: ({ width, height }: { width: number; height: number }) => void,
) => {
  const { width, height } = useWindowSize();

  useEffect(() => {
    setWindowDimensions({ width, height });
  }, [width, height, setWindowDimensions]);
};
