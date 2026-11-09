import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string; // Tailwind bg color or hex
  height?: string;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color,
  height = 'h-2',
  showLabel = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            color && !color.startsWith('#') ? color : ''
          }`}
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color && color.startsWith('#') ? color : undefined,
          }}
        />
      </div>
    </div>
  );
};
