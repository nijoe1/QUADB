import { useEffect } from "react";
import { useWindowSize } from "react-use";

const useWindowDimensions = (setWindowDimensions) => {
  const { width, height } = useWindowSize();

  useEffect(() => {
    setWindowDimensions({ width, height });
  }, [width, height, setWindowDimensions]);
};

export default useWindowDimensions;