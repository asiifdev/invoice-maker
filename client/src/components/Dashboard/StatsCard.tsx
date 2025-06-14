import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "red";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-200",
    accent: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-200",
    accent: "text-green-600",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    border: "border-orange-200",
    accent: "text-orange-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    border: "border-red-200",
    accent: "text-red-600",
  },
};

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: StatsCardProps) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-600"
      : "text-gray-600";
  const classes = colorClasses[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 mr-4">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mb-1 sm:mb-2">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate mb-1 sm:mb-2">
            {value}
          </p>
          <p className={`text-xs sm:text-sm ${trendColor} truncate`}>
            {change}
          </p>
        </div>
        <div
          className={`p-2 sm:p-3 rounded-lg ${classes.bg} ${classes.border} border flex-shrink-0`}
        >
          <Icon
            className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${classes.icon}`}
          />
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="mt-3 sm:hidden">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 rounded-full ${
              trend === "up"
                ? "bg-green-500"
                : trend === "down"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
            style={{
              width: trend === "up" ? "75%" : trend === "down" ? "25%" : "50%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
