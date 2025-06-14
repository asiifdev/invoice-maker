import React from "react";
import { X } from "lucide-react";
import { useResponsive } from "../../hooks/useResponsive";
import { MobileSheet } from "./MobileSheet";

interface AdaptiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function AdaptiveModal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
}: AdaptiveModalProps) {
  const { isMobile } = useResponsive();

  // Use mobile sheet on mobile devices
  if (isMobile) {
    return (
      <MobileSheet isOpen={isOpen} onClose={onClose} title={title}>
        {children}
      </MobileSheet>
    );
  }

  // Use traditional modal on desktop
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
          relative bg-white rounded-xl shadow-xl w-full
          ${sizeClasses[size]}
          animate-fade-in-scale
        `}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
