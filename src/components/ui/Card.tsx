import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white border border-[#e6e8eb] shadow-sm',
        className
      )}
      {...props}
    />
  );
}
