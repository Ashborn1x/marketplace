interface MarketplaceFooterProps {
  onNavigateHome: () => void;
  onNavigateCreate: () => void;
}

export function MarketplaceFooter({
  onNavigateHome,
  onNavigateCreate,
}: MarketplaceFooterProps) {
  return (
    <footer className="w-full bg-white border-t border-[#e6e8eb] py-6 mt-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#727687]">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <span className="font-semibold text-[#191c1e]">
            Marketplace © 2026
          </span>
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            Browse Listings
          </button>
          <button
            type="button"
            onClick={onNavigateCreate}
            className="hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            Sell an Item
          </button>
        </div>

        <span className="text-[12px] text-[#727687]">
          Community Commerce Frontend Preview
        </span>
      </div>
    </footer>
  );
}
