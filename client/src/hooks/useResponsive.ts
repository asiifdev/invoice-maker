import { useState, useEffect } from "react";

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenWidth: number;
}

const breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
};

export function useResponsive(): BreakpointState {
  const [state, setState] = useState<BreakpointState>({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    screenWidth: 0,
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
        isDesktop:
          width >= breakpoints.desktop && width < breakpoints.largeDesktop,
        isLargeDesktop: width >= breakpoints.largeDesktop,
        screenWidth: width,
      });
    };

    // Set initial value
    updateBreakpoint();

    // Add event listener
    window.addEventListener("resize", updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return state;
}
