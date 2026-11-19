import { Plus, SearchX, Store } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  variant: 'empty-marketplace' | 'no-results';
  searchQuery?: string;
  onAction: () => void;
}

export function EmptyState({
  variant,
  searchQuery,
  onAction,
}: EmptyStateProps) {
  const isEmptyMarketplace = variant === 'empty-marketplace';

  return (
    <div className="bg-white rounded-xl border border-[#e6e8eb] p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[320px]">
      <div className="w-16 h-16 rounded-full bg-[#dbe1ff]/60 flex items-center justify-center text-[#0050cd] mb-4">
        {isEmptyMarketplace ? (
          <Store className="w-8 h-8" />
        ) : (
          <SearchX className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-[19px] font-bold text-[#191c1e] mb-1.5">
        {isEmptyMarketplace ? 'No listings yet.' : 'No results found.'}
      </h3>

      <p className="text-[15px] text-[#424656] max-w-md mb-6 leading-relaxed">
        {isEmptyMarketplace
          ? 'Be the first to share something with the community.'
          : searchQuery
          ? `We couldn't find any listings matching “${searchQuery}”. Try another keyword or clear your search.`
          : 'Try adjusting your category filter or search terms to find what you need.'}
      </p>

      {isEmptyMarketplace ? (
        <Button onClick={onAction} size="lg" className="rounded-full">
          <Plus className="w-4 h-4" />
          <span>Create Listing</span>
        </Button>
      ) : (
        <Button
          onClick={onAction}
          variant="secondary"
          size="lg"
          className="rounded-full"
        >
          <span>Clear search</span>
        </Button>
      )}
    </div>
  );
}
