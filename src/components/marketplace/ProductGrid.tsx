import type { Listing } from '../../types/listing';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';

interface ProductGridProps {
  listings: Listing[];
  totalCatalogCount: number;
  isLoading?: boolean;
  searchQuery?: string;
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onClearSearch: () => void;
  onCreateListing: () => void;
}

export function ProductGrid({
  listings,
  totalCatalogCount,
  isLoading = false,
  searchQuery = '',
  savedIds = [],
  onToggleSave,
  onSelectListing,
  onClearSearch,
  onCreateListing,
}: ProductGridProps) {
  if (isLoading) {
    return <LoadingSkeleton count={8} />;
  }

  if (totalCatalogCount === 0) {
    return (
      <EmptyState
        variant="empty-marketplace"
        onAction={onCreateListing}
      />
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        variant="no-results"
        searchQuery={searchQuery}
        onAction={onClearSearch}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {listings.map((listing) => (
        <ProductCard
          key={listing.id}
          listing={listing}
          isSaved={savedIds.includes(listing.id)}
          onToggleSave={onToggleSave}
          onClick={onSelectListing}
        />
      ))}
    </div>
  );
}
