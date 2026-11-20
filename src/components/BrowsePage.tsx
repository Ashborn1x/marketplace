import { useEffect, useState, type FormEvent } from 'react';
import {
  ChevronDown,
  FilterX,
  Heart,
  HelpCircle,
  MapPin,
  Plus,
  PlusSquare,
  RefreshCw,
  Search,
  SearchX,
  Store,
  Tag,
  X,
} from 'lucide-react';
import type { ItemCondition, Listing, RouteView } from '../types/marketplace';
import { SafeImage } from './SafeImage';
import { LoadingSkeleton } from './ui/LoadingSkeleton';

interface BrowsePageProps {
  listings: Listing[];
  isLoading?: boolean;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onBuyNow: (listing: Listing) => Promise<void>;
  onNavigate: (route: RouteView) => void;
  onSearchListings: (query: string, category?: string) => void;
  initialQuery: string;
  initialCategory?: string;
  locationLabel: string;
  radiusMiles: number;
  onOpenLocationModal: () => void;
  onOpenSellerHelpModal: () => void;
  onTriggerSuccessToast: () => void;
}

type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'distance';

type DateFilter = 'all' | '24h' | '7d' | '30d';

export function BrowsePage({
  listings,
  isLoading = false,
  savedIds,
  onToggleSave,
  onSelectListing,
  onBuyNow,
  onNavigate,
  onSearchListings,
  initialQuery,
  initialCategory,
  locationLabel,
  radiusMiles,
  onOpenLocationModal,
  onOpenSellerHelpModal,
  onTriggerSuccessToast,
}: BrowsePageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'laptop');
  const [inputQuery, setInputQuery] = useState(initialQuery || 'laptop');
  const [minPrice, setMinPrice] = useState<string>('300');
  const [maxPrice, setMaxPrice] = useState<string>('1200');
  const [selectedConditions, setSelectedConditions] = useState<ItemCondition[]>(
    []
  );
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'Electronics & Computers'
  );
  const [under40kChip, setUnder40kChip] = useState<boolean>(true);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [offersShippingOnly, setOffersShippingOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showcaseTab, setShowcaseTab] = useState<'all' | 'spec'>('all');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
      setInputQuery(initialQuery);
      if (initialQuery.toLowerCase() !== 'laptop' && initialQuery !== '') {
        setMinPrice('');
        setMaxPrice('');
        setUnder40kChip(false);
        setSelectedCategory('');
      }
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setMinPrice('');
      setMaxPrice('');
      setUnder40kChip(false);
    }
  }, [initialCategory]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchQuery(inputQuery.trim());
    onSearchListings(inputQuery.trim(), selectedCategory || undefined);
    setTimeout(() => setIsSearching(false), 260);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setInputQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedConditions([]);
    setDateFilter('all');
    setSelectedCategory('');
    setUnder40kChip(false);
    setFreeDeliveryOnly(false);
    setVerifiedOnly(false);
    setOffersShippingOnly(false);
    setSortBy('recommended');
  };

  const toggleCondition = (cond: ItemCondition) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const filteredListings = listings
    .filter((item) => {
      // Distance
      if (item.distanceMiles > radiusMiles) return false;

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack =
          `${item.title} ${item.category} ${item.description} ${item.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Category
      if (selectedCategory) {
        const catLower = selectedCategory.toLowerCase();
        const itemCat = item.category.toLowerCase();
        const itemChip = item.filterChipCategory.toLowerCase();
        if (
          catLower === 'electronics & computers' ||
          catLower === 'electronics'
        ) {
          if (itemCat !== 'electronics' && itemChip !== 'electronics')
            return false;
        } else if (catLower === 'home goods') {
          if (itemCat !== 'home goods' && itemChip !== 'home & garden')
            return false;
        } else if (catLower === 'apparel') {
          if (itemCat !== 'apparel' && itemChip !== 'clothing') return false;
        } else if (
          !itemCat.includes(catLower) &&
          !itemChip.includes(catLower)
        ) {
          return false;
        }
      }

      // Price range
      const minNum = minPrice ? parseFloat(minPrice) : null;
      const maxNum = maxPrice ? parseFloat(maxPrice) : null;
      if (minNum !== null && !Number.isNaN(minNum) && item.price < minNum)
        return false;
      if (maxNum !== null && !Number.isNaN(maxNum) && item.price > maxNum)
        return false;
      if (under40kChip && item.price > 1000) return false;

      // Condition
      if (
        selectedConditions.length > 0 &&
        !selectedConditions.includes(item.condition)
      ) {
        return false;
      }

      // Date listed
      if (dateFilter === '24h' && item.listedHoursAgo > 24) return false;
      if (dateFilter === '7d' && item.listedHoursAgo > 168) return false;
      if (dateFilter === '30d' && item.listedHoursAgo > 720) return false;

      // Toggle chips
      if (freeDeliveryOnly && !item.freeDelivery) return false;
      if (verifiedOnly && !item.seller.verified) return false;
      if (offersShippingOnly && !item.offersShipping) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return a.listedHoursAgo - b.listedHoursAgo;
        case 'distance':
          return a.distanceMiles - b.distanceMiles;
        default:
          return 0;
      }
    });

  const sidebarCategories = [
    'Electronics & Computers',
    'Vehicles',
    'Home Goods',
    'Apparel',
  ];

  const conditionOptions: { label: string; value: ItemCondition }[] = [
    { label: 'New', value: 'New' },
    { label: 'Used - Like New', value: 'Like New' },
    { label: 'Used - Good', value: 'Good' },
    { label: 'Used - Fair', value: 'Fair' },
  ];

  const dateOptions: { label: string; value: DateFilter }[] = [
    { label: 'All listings', value: 'all' },
    { label: 'Past 24 hours', value: '24h' },
    { label: 'Past 7 days', value: '7d' },
    { label: 'Past 30 days', value: '30d' },
  ];

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 py-5 flex flex-col lg:flex-row gap-5 items-start">
      {/* Left Navigation & Filtering Rail */}
      <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        {/* Create & Manage Card */}
        <div className="bg-white rounded-xl p-3.5 shadow-sm flex flex-col gap-1">
          <h2 className="text-[17px] leading-[22px] font-semibold text-[#191c1e] mb-1 px-2">
            Create &amp; Manage
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('create-listing')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#eceef1] transition-colors text-[#191c1e] text-left cursor-pointer"
          >
            <PlusSquare className="w-5 h-5 text-[#0050cd]" />
            <span className="font-semibold text-[15px]">Create new listing</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('your-listings')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#eceef1] transition-colors text-[#424656] text-left cursor-pointer"
          >
            <Tag className="w-5 h-5" />
            <span className="font-semibold text-[13px]">Your listings</span>
          </button>
          <button
            type="button"
            onClick={onOpenSellerHelpModal}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#eceef1] transition-colors text-[#424656] text-left cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-semibold text-[13px]">Seller help</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-[#191c1e]">Filters</h3>
            <button
              type="button"
              onClick={handleResetAll}
              className="text-[13px] font-semibold text-[#0050cd] hover:underline cursor-pointer"
            >
              Reset all
            </button>
          </div>

          {/* Location Context */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#727687] uppercase tracking-wider">
              Location &amp; Distance
            </span>
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="flex items-center justify-between p-2.5 bg-[#eceef1] rounded-lg cursor-pointer hover:bg-[#e6e8eb] transition-colors text-left"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-[18px] h-[18px] text-[#0050cd]" />
                <span className="text-[13px] font-semibold text-[#191c1e]">
                  {locationLabel}
                </span>
              </div>
              <span className="text-[13px] text-[#424656]">
                Within {radiusMiles} mi
              </span>
            </button>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#727687] uppercase tracking-wider">
              Price Range (USD)
            </span>
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <span className="absolute left-2.5 top-2 text-[#424656] text-[12px] font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  aria-label="Minimum price"
                  className="w-full pl-6 pr-2 py-1.5 bg-[#eceef1] rounded-lg text-[13px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] tabular-nums"
                />
              </div>
              <span className="text-[#727687] font-semibold">-</span>
              <div className="relative w-full">
                <span className="absolute left-2.5 top-2 text-[#424656] text-[12px] font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  aria-label="Maximum price"
                  className="w-full pl-6 pr-2 py-1.5 bg-[#eceef1] rounded-lg text-[13px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#727687] uppercase tracking-wider">
              Condition
            </span>
            <div className="flex flex-col gap-1">
              {conditionOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-[#eceef1] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(opt.value)}
                    onChange={() => toggleCondition(opt.value)}
                    className="w-4 h-4 rounded accent-[#0866ff] cursor-pointer"
                  />
                  <span className="text-[13px] text-[#191c1e]">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Listed */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#727687] uppercase tracking-wider">
              Date Listed
            </span>
            <div className="flex flex-col gap-1">
              {dateOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-[#eceef1] transition-colors"
                >
                  <input
                    type="radio"
                    name="date_filter"
                    checked={dateFilter === opt.value}
                    onChange={() => setDateFilter(opt.value)}
                    className="w-4 h-4 accent-[#0866ff] cursor-pointer"
                  />
                  <span className="text-[13px] text-[#191c1e]">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories Quick Links */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#727687] uppercase tracking-wider">
              Categories
            </span>
            <div className="flex flex-col gap-1">
              {sidebarCategories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setSelectedCategory((prev) => (prev === cat ? '' : cat))
                    }
                    className={`p-2 rounded-lg text-left text-[13px] transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#d8e2ff]/60 text-[#0058bc] font-semibold'
                        : 'text-[#424656] hover:bg-[#eceef1]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 w-full flex flex-col gap-4 min-w-0">
        {/* Interactive Search Bar Section */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full bg-white p-3 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-2.5 text-[#0050cd] pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search items, brands, or categories..."
              aria-label="Search results query"
              className="w-full pl-10 pr-10 py-2 bg-[#eceef1] rounded-full text-[15px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => {
                  setInputQuery('');
                  setSearchQuery('');
                }}
                title="Clear query"
                className="absolute right-3 top-2 text-[#424656] hover:text-[#191c1e] p-1 rounded-full hover:bg-[#e6e8eb] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="w-full md:w-auto h-10 px-6 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[15px] rounded-full shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Search className="w-[18px] h-[18px]" />
            <span>Search</span>
          </button>
        </form>

        {/* Search Query Header & Sorting Dropdown */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-[24px] leading-[30px] font-bold text-[#191c1e]">
              {searchQuery
                ? `Results for “${searchQuery}”`
                : 'All Marketplace listings'}
            </h1>
            <p className="text-[13px] text-[#424656] tabular-nums">
              in {locationLabel} • {filteredListings.length} listing
              {filteredListings.length === 1 ? '' : 's'} available
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[13px] font-semibold text-[#424656]">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort listings"
                className="appearance-none bg-white font-semibold text-[13px] text-[#191c1e] py-2 pl-3.5 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0866ff] cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Date Listed: Newest</option>
                <option value="distance">Distance: Nearest First</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-[#727687]" />
            </div>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d8e2ff]/70 text-[#0058bc] rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap"
            >
              <span>
                {selectedCategory === 'Electronics & Computers'
                  ? 'Electronics'
                  : selectedCategory}
              </span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {under40kChip && (
            <button
              type="button"
              onClick={() => setUnder40kChip(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d8e2ff]/70 text-[#0058bc] rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap"
            >
              <span>Under $1,000</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setFreeDeliveryOnly((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors whitespace-nowrap ${
              freeDeliveryOnly
                ? 'bg-[#d8e2ff]/70 text-[#0058bc]'
                : 'bg-[#eceef1] text-[#424656] hover:bg-[#e6e8eb]'
            }`}
          >
            Free delivery
          </button>
          <button
            type="button"
            onClick={() => setVerifiedOnly((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors whitespace-nowrap ${
              verifiedOnly
                ? 'bg-[#d8e2ff]/70 text-[#0058bc]'
                : 'bg-[#eceef1] text-[#424656] hover:bg-[#e6e8eb]'
            }`}
          >
            Verified sellers only
          </button>
          <button
            type="button"
            onClick={() => setOffersShippingOnly((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors whitespace-nowrap ${
              offersShippingOnly
                ? 'bg-[#d8e2ff]/70 text-[#0058bc]'
                : 'bg-[#eceef1] text-[#424656] hover:bg-[#e6e8eb]'
            }`}
          >
            Offers shipping
          </button>
        </div>

        {/* Main Result Cards Grid (with loading & empty handling) */}
        {isLoading || isSearching ? (
          <LoadingSkeleton count={4} className="w-full" />
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {filteredListings.map((item) => {
              const isSaved = savedIds.includes(item.id);
              const badgeColor =
                item.badge === 'Top Pick'
                  ? 'bg-[#0866ff] text-white'
                  : item.badge === 'Verified'
                  ? 'bg-[#0070eb] text-white'
                  : 'bg-[#191c1e]/80 text-white';

              return (
                <article
                  key={item.id}
                  onClick={() => onSelectListing(item)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group cursor-pointer"
                >
                  <div className="relative w-full aspect-square bg-[#eceef1] overflow-hidden">
                    <SafeImage
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.badge && (
                      <span
                        className={`absolute top-2.5 left-2.5 px-2 py-0.5 backdrop-blur-sm rounded text-[11px] font-bold ${badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                        isSaved
                          ? 'text-[#ba1a1a]'
                          : 'text-[#191c1e] hover:text-[#ba1a1a] hover:scale-110'
                      }`}
                    >
                      <Heart
                        className="w-[17px] h-[17px]"
                        fill={isSaved ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                  <div className="p-3.5 flex flex-col gap-0.5">
                    <div className="text-[17px] leading-[22px] text-[#191c1e] font-bold tabular-nums">
                      {item.currency}
                      {item.price.toLocaleString('en-US')}
                    </div>
                    <h3 className="text-[15px] leading-[20px] text-[#191c1e] truncate group-hover:text-[#0050cd] transition-colors">
                      {item.title}
                    </h3>
                    {item.status === 'sold' ? (
                      <span className="mt-2 inline-flex text-[12px] font-bold text-[#727687]">Sold</span>
                    ) : item.canPurchase ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void onBuyNow(item);
                        }}
                        className="mt-2 w-full h-9 bg-[#0866ff] hover:bg-[#0050cd] text-white text-[12px] font-bold rounded-lg cursor-pointer"
                      >
                        Buy Now
                      </button>
                    ) : null}
                    <div className="text-[13px] text-[#727687] truncate">
                      {item.listedLabel} • {item.location}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center text-center justify-center min-h-[280px]">
            <div className="w-16 h-16 rounded-full bg-[#eceef1] flex items-center justify-center text-[#0050cd] mb-3">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-[17px] font-bold text-[#191c1e] mb-1">
              No results found {searchQuery ? `for “${searchQuery}”` : ''}
            </h3>
            <p className="text-[15px] text-[#424656] max-w-sm mb-5">
              Try checking your spelling, removing applied filters, or using more general search terms.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="px-5 py-2 bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] font-semibold text-[15px] rounded-full transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FilterX className="w-4 h-4" />
              <span>Clear filters</span>
            </button>
          </div>
        )}

        {/* Application States Showcase Section */}
        <div className="w-full mt-5 pt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#0866ff] rounded-full shrink-0" />
              <div>
                <h2 className="text-[20px] leading-[26px] font-semibold text-[#191c1e]">
                  Application States Showcase
                </h2>
                <p className="text-[13px] text-[#424656]">
                  Live review of system feedback, empty states, and transition skeletons
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-[#eceef1] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setShowcaseTab('all')}
                className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                  showcaseTab === 'all'
                    ? 'bg-white text-[#191c1e] shadow-sm'
                    : 'text-[#424656] hover:text-[#191c1e]'
                }`}
              >
                All States
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowcaseTab('spec');
                  onTriggerSuccessToast();
                }}
                className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                  showcaseTab === 'spec'
                    ? 'bg-white text-[#191c1e] shadow-sm'
                    : 'text-[#424656] hover:text-[#191c1e]'
                }`}
              >
                Spec Ready
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* STATE A: No Results Found Empty State */}
            <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center text-center justify-center min-h-[290px] relative overflow-hidden">
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#eceef1] text-[#424656] rounded text-[11px] font-bold">
                State A: Search Miss
              </span>
              <div className="w-16 h-16 rounded-full bg-[#eceef1] flex items-center justify-center text-[#0050cd] mb-3">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-[17px] font-bold text-[#191c1e] mb-1">
                No results found for “vintage typewriter”
              </h3>
              <p className="text-[15px] text-[#424656] max-w-sm mb-5">
                Try checking your spelling, removing applied filters, or using more general search terms.
              </p>
              <button
                type="button"
                onClick={handleResetAll}
                className="px-5 py-2 bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] font-semibold text-[15px] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FilterX className="w-4 h-4" />
                <span>Clear filters</span>
              </button>
            </div>

            {/* STATE B: Loading Skeleton State */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
              <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-[#eceef1] text-[#424656] rounded text-[11px] font-bold">
                State B: Loading Skeleton
              </span>
              <div className="grid grid-cols-2 gap-3 pt-6">
                <div className="flex flex-col gap-1.5 animate-pulse">
                  <div className="w-full aspect-square bg-[#e6e8eb] rounded-xl" />
                  <div className="w-1/2 h-5 bg-[#e6e8eb] rounded mt-1" />
                  <div className="w-full h-4 bg-[#e6e8eb] rounded" />
                  <div className="w-2/3 h-3 bg-[#e6e8eb] rounded" />
                </div>
                <div className="flex flex-col gap-1.5 animate-pulse">
                  <div className="w-full aspect-square bg-[#e6e8eb] rounded-xl" />
                  <div className="w-2/5 h-5 bg-[#e6e8eb] rounded mt-1" />
                  <div className="w-4/5 h-4 bg-[#e6e8eb] rounded" />
                  <div className="w-1/2 h-3 bg-[#e6e8eb] rounded" />
                </div>
              </div>
              <div className="w-full flex items-center justify-between text-[#727687] text-[11px] font-bold pt-1">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching live network listings...</span>
                </span>
                <span className="tabular-nums">45% cached</span>
              </div>
            </div>

            {/* STATE D: Empty Marketplace Category State */}
            <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center text-center justify-center min-h-[280px] relative overflow-hidden md:col-span-2">
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#eceef1] text-[#424656] rounded text-[11px] font-bold">
                State D: Empty Category
              </span>
              <div className="w-16 h-16 rounded-full bg-[#d8e2ff]/50 flex items-center justify-center text-[#0058bc] mb-3">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-[17px] font-bold text-[#191c1e] mb-1">
                No listings yet in this category
              </h3>
              <p className="text-[15px] text-[#424656] max-w-md mb-5">
                Be the first to share something with your local community. It only takes a couple of minutes to publish.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('create-listing')}
                  className="px-5 py-2.5 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[15px] rounded-full shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Listing</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleResetAll();
                    onNavigate('home');
                  }}
                  className="px-5 py-2.5 bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] font-semibold text-[15px] rounded-full transition-colors cursor-pointer"
                >
                  Explore nearby communities
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
