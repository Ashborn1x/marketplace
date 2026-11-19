import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import type { Listing, MarketplaceCategory } from '../../types/listing';
import { Button } from '../ui/Button';
import { SearchBar } from '../marketplace/SearchBar';
import { CategoryTabs } from '../marketplace/CategoryTabs';
import { ProductGrid } from '../marketplace/ProductGrid';

interface MarketplaceHomePageProps {
  listings: Listing[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: MarketplaceCategory;
  onSelectCategory: (cat: MarketplaceCategory) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onNavigateCreate: () => void;
  isBrowseMode?: boolean;
}

type SortOrder = 'newest' | 'price-asc' | 'price-desc';

export function MarketplaceHomePage({
  listings,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  savedIds,
  onToggleSave,
  onSelectListing,
  onNavigateCreate,
  isBrowseMode = false,
}: MarketplaceHomePageProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isFiltering, setIsFiltering] = useState(false);

  const handleCategoryChange = (cat: MarketplaceCategory) => {
    setIsFiltering(true);
    onSelectCategory(cat);
    setTimeout(() => setIsFiltering(false), 160);
  };

  const filteredListings = listings
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Items' || item.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.location?.toLowerCase().includes(q) ?? false);

      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return a.listedHoursAgo - b.listedHoursAgo;
    });

  const handleClearFilters = () => {
    onSearchChange('');
    onSelectCategory('All Items');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
      {/* Page Heading */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] leading-[36px] font-bold text-[#191c1e] tracking-tight">
            {isBrowseMode ? 'Browse Marketplace' : 'Marketplace'}
          </h1>
          <p className="text-[15px] text-[#424656] mt-1">
            Discover great deals and find amazing items in your community.
          </p>
        </div>

        <Button
          size="lg"
          onClick={onNavigateCreate}
          className="rounded-full self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Listing</span>
        </Button>
      </section>

      {/* Search and Sorting Controls */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="w-full md:max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by title or description..."
            inputClassName="bg-white border border-[#e6e8eb] shadow-sm h-11"
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <span className="text-[13px] font-medium text-[#727687] tabular-nums">
            {filteredListings.length} listing
            {filteredListings.length === 1 ? '' : 's'}
          </span>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              aria-label="Sort listings"
              className="appearance-none bg-white border border-[#e6e8eb] text-[13px] font-semibold text-[#191c1e] h-10 pl-3.5 pr-9 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0866ff] cursor-pointer"
            >
              <option value="newest">Sort: Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#727687] absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Horizontal Category Navigation */}
      <section aria-label="Category filters">
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </section>

      {/* Product Listing Grid */}
      <section aria-label="Product listings">
        <ProductGrid
          listings={filteredListings}
          totalCatalogCount={listings.length}
          isLoading={isFiltering}
          searchQuery={searchQuery}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onSelectListing={onSelectListing}
          onClearSearch={handleClearFilters}
          onCreateListing={onNavigateCreate}
        />
      </section>
    </div>
  );
}
