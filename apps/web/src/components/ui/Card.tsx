import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = ''
}) => {
  return (
    <div className={`bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-quantara-800/80">
          <div>
            {title && <h3 className="text-sm font-bold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-quantara-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
