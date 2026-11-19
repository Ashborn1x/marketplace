import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-lg border border-[#e0e3e6] bg-[#f7f9fc] px-3.5 py-2 text-[14px] text-[#191c1e] placeholder:text-[#727687] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866ff] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'flex w-full rounded-lg border border-[#e0e3e6] bg-[#f7f9fc] px-3.5 py-2.5 text-[14px] text-[#191c1e] placeholder:text-[#727687] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866ff] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
