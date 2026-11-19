import { useState } from 'react';
import { Menu, Plus, X } from 'lucide-react';
import type { RouteView } from '../types/marketplace';
import { MARKETPLACE_LOGO_URL, USER_AVATAR_URL } from '../data/mockListings';
import { SafeImage } from './SafeImage';

interface HeaderProps {
  activeRoute: RouteView;
  onNavigate: (route: RouteView) => void;
  unreadNotifications: number;
  unreadMessages: number;
}

export function Header({
  activeRoute,
  onNavigate,
  unreadNotifications,
  unreadMessages,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; route: RouteView; count?: number }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Browse', route: 'browse' },
    { label: 'Notifications', route: 'notifications', count: unreadNotifications },
    { label: 'Inbox', route: 'inbox', count: unreadMessages },
  ];

  const isNavActive = (route: RouteView) => {
    if (route === 'browse' && activeRoute === 'listing-detail') return true;
    return activeRoute === route;
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-[#e6e8eb]">
      <div className="max-w-[1680px] mx-auto h-16 px-4 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0866ff] rounded-lg shrink-0"
        >
          <SafeImage
            src={MARKETPLACE_LOGO_URL}
            alt="Marketplace Logo"
            className="h-8 w-8 object-contain rounded-lg"
          />
          <span className="text-[20px] leading-[26px] text-[#191c1e] font-bold tracking-tight whitespace-nowrap">
            Marketplace
          </span>
        </button>

        {/* Zone 2: Primary Navigation */}
        <nav
          className="hidden md:flex items-center h-full gap-7"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const active = isNavActive(item.route);
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                aria-current={active ? 'page' : undefined}
                className={`h-full flex items-center gap-1.5 px-1 text-[15px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  active
                    ? 'text-[#0050cd] border-b-2 border-[#0050cd] font-bold'
                    : 'text-[#424656] hover:text-[#191c1e] font-semibold'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[11px] font-bold text-[#0050cd] tabular-nums">
                    ({item.count})
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('create-listing')}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 h-10 px-4 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[14px] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('your-listings')}
            title="Your listings & saved items"
            aria-label="Your listings and profile"
            className={`cursor-pointer rounded-full p-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0866ff] ${
              activeRoute === 'your-listings'
                ? 'ring-2 ring-[#0866ff]'
                : 'hover:opacity-90'
            }`}
          >
            <SafeImage
              src={USER_AVATAR_URL}
              alt="Your Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e6e8eb] px-4 py-3 flex flex-col gap-2 shadow-md">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const active = isNavActive(item.route);
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => {
                    onNavigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-left text-sm font-semibold transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-[#dbe1ff] text-[#0050cd]'
                      : 'bg-[#f2f4f7] text-[#191c1e] hover:bg-[#e6e8eb]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[11px] font-bold tabular-nums">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigate('create-listing');
              setMobileMenuOpen(false);
            }}
            className="sm:hidden w-full h-10 bg-[#0866ff] text-white font-semibold text-sm rounded-full flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </button>
        </div>
      )}
    </header>
  );
}
