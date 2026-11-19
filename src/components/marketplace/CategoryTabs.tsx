import type { MarketplaceCategory } from '../../types/listing';
import { MARKETPLACE_CATEGORIES } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

interface CategoryTabsProps {
  selectedCategory: MarketplaceCategory;
  onSelectCategory: (category: MarketplaceCategory) => void;
}

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Marketplace categories"
      className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
    >
      {MARKETPLACE_CATEGORIES.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap cursor-pointer border',
              isActive
                ? 'bg-[#0866ff] text-white border-[#0866ff] shadow-sm'
                : 'bg-white text-[#191c1e] border-[#e6e8eb] hover:bg-[#eceef1]'
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
