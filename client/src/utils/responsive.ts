export const breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
} as const;

export function getBreakpoint(
  width: number
): keyof typeof breakpoints | "largeDesktop" {
  if (width < breakpoints.mobile) return "mobile";
  if (width < breakpoints.tablet) return "tablet";
  if (width < breakpoints.desktop) return "desktop";
  return "largeDesktop";
}

export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function hasTouch(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function getOptimalImageSize(width: number): string {
  if (width <= 480) return "sm";
  if (width <= 768) return "md";
  if (width <= 1024) return "lg";
  return "xl";
}

export function formatCurrency(
  amount: number,
  locale: string = "id-ID"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "id-ID" ? "IDR" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
