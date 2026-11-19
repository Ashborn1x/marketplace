import { useState } from 'react';
import { Menu, Plus, X } from 'lucide-react';
import { MARKETPLACE_LOGO_URL, USER_AVATAR_URL } from '../../lib/mock-data';
import { SafeImage } from '../SafeImage';
import { SearchBar } from '../marketplace/SearchBar';
import { Button } from '../ui/Button';

export type AppPath = '/' | '/browse' | '/create-listing' | `/listing/${string}`;

interface MarketplaceHeaderProps {
  currentPath: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onNavigate: (path: string) => void;
}

export function MarketplaceHeader({
  currentPath,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNavigate,
}: MarketplaceHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = currentPath === '/';
  const isBrowse =
    currentPath === '/browse' || currentPath.startsWith('/listing/');

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40 w-full bg-white border-b border-[#e6e8eb]">
      <div className="max-w-[1440px] mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand + Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866ff] rounded-lg"
          >
            <SafeImage
              src={MARKETPLACE_LOGO_URL}
              alt="Marketplace Logo"
              className="h-8 w-8 object-contain rounded-lg"
            />
            <span className="text-[20px] font-bold tracking-tight text-[#191c1e] whitespace-nowrap">
              Marketplace
            </span>
          </button>

          <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm ml-2">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
              placeholder="Search Marketplace"
            />
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center h-full gap-6"
        >
          <button
            type="button"
            onClick={() => handleNav('/')}
            aria-current={isHome ? 'page' : undefined}
            className={`h-full flex items-center px-2 text-[15px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              isHome
                ? 'text-[#0866ff] border-b-2 border-[#0866ff] font-bold'
                : 'text-[#424656] hover:text-[#191c1e] font-semibold'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('/browse')}
            aria-current={isBrowse ? 'page' : undefined}
            className={`h-full flex items-center px-2 text-[15px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              isBrowse
                ? 'text-[#0866ff] border-b-2 border-[#0866ff] font-bold'
                : 'text-[#424656] hover:text-[#191c1e] font-semibold'
            }`}
          >
            Browse
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={() => handleNav('/create-listing')}
            className="hidden sm:inline-flex rounded-full px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Button>

          <button
            type="button"
            onClick={() => handleNav('/')}
            title="Profile"
            aria-label="User profile"
            className="w-9 h-9 rounded-full overflow-hidden border border-[#e6e8eb] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866ff]"
          >
            <SafeImage
              src={USER_AVATAR_URL}
              alt="User profile avatar"
              className="w-full h-full object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-10 h-10 rounded-full bg-[#eceef1] hover:bg-[#e0e3e6] flex items-center justify-center text-[#191c1e] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e6e8eb] px-4 py-3 flex flex-col gap-3 shadow-md">
          <div className="md:hidden">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onSubmit={() => {
                onSearchSubmit();
                setMobileMenuOpen(false);
              }}
              placeholder="Search Marketplace"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left cursor-pointer ${
                isHome
                  ? 'bg-[#dbe1ff] text-[#0050cd]'
                  : 'bg-[#f2f4f7] text-[#191c1e]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNav('/browse')}
              className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left cursor-pointer ${
                isBrowse
                  ? 'bg-[#dbe1ff] text-[#0050cd]'
                  : 'bg-[#f2f4f7] text-[#191c1e]'
              }`}
            >
              Browse
            </button>
          </div>
          <Button
            onClick={() => handleNav('/create-listing')}
            className="sm:hidden w-full rounded-full"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Button>
        </div>
      )}
    </header>
  );
}
