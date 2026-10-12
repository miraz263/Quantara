import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'sm'
}) => {
  const variantStyles = {
    blue: "bg-blue-950 text-blue-300 border-blue-800",
    emerald: "bg-emerald-950 text-emerald-300 border-emerald-800",
    amber: "bg-amber-950 text-amber-300 border-amber-800",
    purple: "bg-purple-950 text-purple-300 border-purple-800",
    rose: "bg-rose-950 text-rose-300 border-rose-800",
    gray: "bg-quantara-800 text-quantara-300 border-quantara-700"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-mono font-medium rounded border",
    md: "px-2.5 py-1 text-xs font-mono font-semibold rounded-md border"
  };

  return (
    <span className={`inline-flex items-center gap-1 ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};
