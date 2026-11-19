import { useState, type FormEvent } from 'react';
import {
  ChevronDown,
  Heart,
  HelpCircle,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Tag,
  Bookmark,
  Store,
} from 'lucide-react';
import type { Listing, RouteView } from '../types/marketplace';
import { QUICK_FILTER_CHIPS, SIDEBAR_CATEGORIES } from '../data/mockListings';
import { CategoryIcon } from './CategoryIcon';
import { SafeImage } from './SafeImage';
import { LoadingSkeleton } from './ui/LoadingSkeleton';

interface HomePageProps {
  listings: Listing[];
  isLoading?: boolean;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onNavigate: (route: RouteView) => void;
  onSearchToBrowse: (query: string, category?: string) => void;
  locationLabel: string;
  radiusMiles: number;
  onOpenLocationModal: () => void;
  onOpenSafetyModal: () => void;
  onOpenSellerHelpModal: () => void;
}

export function HomePage({
  listings,
  isLoading = false,
  savedIds,
  onToggleSave,
  onSelectListing,
  onNavigate,
  onSearchToBrowse,
  locationLabel,
  radiusMiles,
  onOpenLocationModal,
  onOpenSafetyModal,
  onOpenSellerHelpModal,
}: HomePageProps) {
  const [selectedChip, setSelectedChip] = useState<string>('All Items');
  const [selectedSidebarCat, setSelectedSidebarCat] = useState<string | null>(null);
  const [inlineQuery, setInlineQuery] = useState('');

  const handleInlineSearch = (e: FormEvent) => {
    e.preventDefault();
    onSearchToBrowse(inlineQuery.trim(), selectedSidebarCat || undefined);
  };

  const filteredListings = listings.filter((item) => {
    const matchesDistance = item.distanceMiles <= radiusMiles;
    const matchesChip =
      selectedChip === 'All Items' ||
      item.filterChipCategory.toLowerCase() === selectedChip.toLowerCase() ||
      item.category.toLowerCase() === selectedChip.toLowerCase();
    const matchesSidebar =
      !selectedSidebarCat ||
      item.category.toLowerCase() === selectedSidebarCat.toLowerCase() ||
      item.filterChipCategory.toLowerCase() === selectedSidebarCat.toLowerCase();

    return matchesDistance && matchesChip && matchesSidebar;
  });

  const formatPrice = (item: Listing) =>
    `${item.currency}${item.price.toLocaleString('en-US')}`;

  return (
    <div className="w-full max-w-[1680px] mx-auto flex flex-col lg:flex-row items-start px-4 sm:px-8 py-4 gap-5">
      {/* Left Navigation Rail (Desktop) */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 bg-white rounded-xl shadow-sm p-3">
        {/* Create listing section */}
        <div className="flex flex-col space-y-1 pb-3">
          <h2 className="text-[17px] leading-[22px] font-semibold text-[#191c1e] px-2 pt-1 mb-1">
            Create new listing
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('create-listing')}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-[#eceef1] transition-colors text-[#191c1e] text-left cursor-pointer group"
          >
            <Tag className="w-5 h-5 text-[#424656] group-hover:text-[#0050cd] transition-colors" />
            <span className="text-[15px] font-medium">Choose listing type</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('your-listings')}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-[#eceef1] transition-colors text-[#191c1e] text-left cursor-pointer group"
          >
            <Bookmark className="w-5 h-5 text-[#424656] group-hover:text-[#0050cd] transition-colors" />
            <span className="text-[15px] font-medium">Your listings</span>
          </button>
          <button
            type="button"
            onClick={onOpenSellerHelpModal}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-[#eceef1] transition-colors text-[#191c1e] text-left cursor-pointer group"
          >
            <HelpCircle className="w-5 h-5 text-[#424656] group-hover:text-[#0050cd] transition-colors" />
            <span className="text-[15px] font-medium">Seller help</span>
          </button>
        </div>

        <div className="h-px bg-[#e6e8eb] my-1" />

        {/* Categories section */}
        <div className="flex flex-col space-y-0.5 pt-3">
          <div className="flex items-center justify-between px-2 pb-1">
            <h2 className="text-[17px] leading-[22px] font-semibold text-[#191c1e]">
              Categories
            </h2>
            {selectedSidebarCat && (
              <button
                type="button"
                onClick={() => setSelectedSidebarCat(null)}
                className="text-[12px] font-semibold text-[#0050cd] hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          {SIDEBAR_CATEGORIES.map((cat) => {
            const isActive = selectedSidebarCat === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setSelectedSidebarCat((prev) =>
                    prev === cat.name ? null : cat.name
                  );
                  setSelectedChip('All Items');
                }}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#dbe1ff] text-[#0050cd] font-semibold'
                    : 'text-[#191c1e] hover:bg-[#eceef1]'
                }`}
              >
                <CategoryIcon
                  name={cat.name}
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-[#0050cd]' : 'text-[#424656]'
                  }`}
                />
                <span className="text-[15px] truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Stream */}
      <section className="flex-1 w-full min-w-0">
        {/* Top Action Bar / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-[24px] leading-[30px] font-bold text-[#191c1e] tracking-tight">
              {selectedSidebarCat ? `${selectedSidebarCat} picks` : "Today's picks"}
            </h1>
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-1 mt-1 text-[#0050cd] hover:text-[#0866ff] font-semibold text-[13px] transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>
                {locationLabel} • Within {radiusMiles} mi
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar Row */}
          <form
            onSubmit={handleInlineSearch}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <div className="relative flex-1 sm:w-72">
              <Search className="w-[18px] h-[18px] absolute left-3 top-2.5 text-[#727687] pointer-events-none" />
              <input
                type="text"
                value={inlineQuery}
                onChange={(e) => setInlineQuery(e.target.value)}
                placeholder="Search listings..."
                aria-label="Search listings"
                className="w-full h-10 pl-9 pr-4 bg-white rounded-lg text-[13px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 bg-[#191c1e] hover:bg-[#424656] text-white font-semibold text-[13px] rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Horizontal Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {QUICK_FILTER_CHIPS.map((chip) => {
            const active = selectedChip === chip && !selectedSidebarCat;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setSelectedChip(chip);
                  setSelectedSidebarCat(null);
                }}
                className={`shrink-0 px-4 py-1.5 rounded-full font-semibold text-[13px] transition-colors shadow-sm cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#dbe1ff] text-[#0050cd]'
                    : 'bg-white hover:bg-[#e6e8eb] text-[#191c1e]'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* High Density Product Grid */}
        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.map((item) => {
              const isSaved = savedIds.includes(item.id);
              return (
                <article
                  key={item.id}
                  onClick={() => onSelectListing(item)}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
                >
                  <div className="relative w-full aspect-square bg-[#eceef1] overflow-hidden">
                    <SafeImage
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                        isSaved
                          ? 'text-[#ba1a1a]'
                          : 'text-[#191c1e] hover:text-[#ba1a1a]'
                      }`}
                    >
                      <Heart
                        className="w-[17px] h-[17px]"
                        fill={isSaved ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="text-[17px] leading-[22px] text-[#191c1e] font-bold tabular-nums">
                        {formatPrice(item)}
                      </div>
                      <h3 className="text-[15px] leading-[20px] text-[#191c1e] font-normal line-clamp-1 mt-0.5 group-hover:text-[#0050cd] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="mt-1.5">
                      <p className="text-[13px] leading-[18px] text-[#424656]">
                        {item.listedLabel}
                      </p>
                      <p className="text-[13px] leading-[18px] text-[#727687]">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-10 shadow-sm flex flex-col items-center text-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#0058bc] mb-4">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-[17px] font-bold text-[#191c1e] mb-1">
              No listings yet in this category
            </h3>
            <p className="text-[15px] text-[#424656] max-w-md mb-5">
              Be the first to share something with your local community. It only takes a couple of minutes to publish.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
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
                  setSelectedChip('All Items');
                  setSelectedSidebarCat(null);
                }}
                className="px-5 py-2.5 bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] font-semibold text-[15px] rounded-full transition-colors cursor-pointer"
              >
                View All Today&apos;s Picks
              </button>
            </div>
          </div>
        )}

        {/* Community Trust Banner */}
        <div className="mt-6 bg-white rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#0050cd]" />
            </div>
            <div>
              <h4 className="text-[17px] leading-[22px] font-semibold text-[#191c1e]">
                Buying and Selling on Marketplace
              </h4>
              <p className="text-[13px] leading-[18px] text-[#424656]">
                Inspect items in person, chat directly with sellers, and use secure payment methods.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSafetyModal}
            className="h-10 px-5 bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] font-semibold text-[13px] rounded-lg shrink-0 transition-colors cursor-pointer whitespace-nowrap"
          >
            Learn More About Safety
          </button>
        </div>
      </section>
    </div>
  );
}
