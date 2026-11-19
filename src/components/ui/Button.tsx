import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    default:
      'bg-[#0866ff] text-white hover:bg-[#0050cd] shadow-sm disabled:opacity-60',
    secondary:
      'bg-[#eceef1] text-[#191c1e] hover:bg-[#e0e3e6] disabled:opacity-60',
    outline:
      'border border-[#c2c6d8] bg-white text-[#191c1e] hover:bg-[#f2f4f7] disabled:opacity-60',
    ghost:
      'bg-transparent text-[#424656] hover:bg-[#eceef1] hover:text-[#191c1e]',
    destructive:
      'bg-[#ba1a1a] text-white hover:bg-[#93000a] shadow-sm disabled:opacity-60',
  };

  const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-11 px-6 text-[15px]',
    icon: 'h-10 w-10 p-0',
  };

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866ff] focus-visible:ring-offset-2 disabled:pointer-events-none cursor-pointer whitespace-nowrap shrink-0',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
