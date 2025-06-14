import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-200',
    gradient: 'from-green-500 to-green-600'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-200',
    gradient: 'from-orange-500 to-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-200',
    gradient: 'from-red-500 to-red-600'
  }
};

export function StatsCard({ title, value, change, trend, icon: Icon, color }: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const classes = colorClasses[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="mt-2 text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 break-words">{value}</p>
          <p className={`mt-2 text-xs lg:text-sm ${trendColor} flex items-center`}>
            {trend === 'up' && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className="truncate">{change}</span>
          </p>
        </div>
        <div className={`p-2 lg:p-3 rounded-lg ${classes.bg} ${classes.border} border group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-4 h-4 lg:w-5 xl:w-6 lg:h-5 xl:h-6 ${classes.icon}`} />
        </div>
      </div>
      
      {/* Subtle gradient line at bottom */}
      <div className={`mt-4 h-1 bg-gradient-to-r ${classes.gradient} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
    </div>
  );
}