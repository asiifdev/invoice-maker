import React from "react";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-4",
  md: "gap-4 sm:gap-6",
  lg: "gap-4 sm:gap-6 lg:gap-8",
};

export function ResponsiveGrid({
  children,
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
}: ResponsiveGridProps) {
  const gridCols = `
    grid-cols-${cols.mobile || 1}
    ${cols.tablet ? `sm:grid-cols-${cols.tablet}` : ""}
    ${cols.desktop ? `lg:grid-cols-${cols.desktop}` : ""}
  `;

  return (
    <div
      className={`
      grid
      ${gridCols}
      ${gapClasses[gap]}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
