import { useState, useEffect } from "react";

interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  hasTouch: boolean;
}

export function useViewport(): ViewportState {
  const [viewport, setViewport] = useState<ViewportState>({
    width: 0,
    height: 0,
    isMobile: false,
    isLandscape: false,
    isPortrait: true,
    hasTouch: false,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isLandscape = width > height;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setViewport({
        width,
        height,
        isMobile,
        isLandscape,
        isPortrait: !isLandscape,
        hasTouch,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  return viewport;
}
