import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
}

export function Card({ children, className, variant = 'default', hover = false }: CardProps) {
  const baseStyles = 'rounded-lg p-6 transition-all duration-300';
  
  const variants = {
    default: 'bg-surface shadow-card border border-gray-200',
    glass: 'glass-effect text-white',
    gradient: 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20'
  };

  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div className={cn(baseStyles, variants[variant], hoverStyles, className)}>
      {children}
    </div>
  );
}
