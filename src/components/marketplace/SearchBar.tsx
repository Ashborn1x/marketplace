import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search Marketplace',
  className,
  inputClassName,
}: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn('relative flex items-center w-full', className)}
    >
      <Search className="w-[18px] h-[18px] absolute left-3.5 text-[#727687] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'w-full h-10 pl-10 pr-9 bg-[#eceef1] rounded-full text-[14px] text-[#191c1e] placeholder:text-[#727687] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all',
          inputClassName
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          title="Clear search"
          className="absolute right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[#727687] hover:text-[#191c1e] hover:bg-[#e0e3e6] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
