import React from "react";
import { useResponsive } from "../../hooks/useResponsive";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "px-4 sm:px-6",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-4 sm:px-6 lg:px-8 xl:px-12",
};

export function ResponsiveContainer({
  children,
  className = "",
  maxWidth = "xl",
  padding = "md",
}: ResponsiveContainerProps) {
  const { isMobile } = useResponsive();

  return (
    <div
      className={`
      w-full mx-auto
      ${maxWidthClasses[maxWidth]}
      ${paddingClasses[padding]}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
