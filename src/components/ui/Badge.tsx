import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-[#eceef1] text-[#424656]',
    primary: 'bg-[#dbe1ff] text-[#0050cd]',
    secondary: 'bg-[#d8e2ff] text-[#001a41]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
