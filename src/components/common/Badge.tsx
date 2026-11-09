import React from 'react';
import { TaskPriority } from '../../models/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700',
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClasses} ${variantClasses} ${className}`}>
      {icon}
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TaskPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  if (priority === 'high') {
    return (
      <Badge variant="danger" size={size}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        High Priority
      </Badge>
    );
  }
  if (priority === 'medium') {
    return (
      <Badge variant="warning" size={size}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Medium
      </Badge>
    );
  }
  return (
    <Badge variant="success" size={size}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Low
    </Badge>
  );
};
