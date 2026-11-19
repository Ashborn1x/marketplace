interface FooterProps {
  onOpenSafety: () => void;
  onOpenSellerHelp: () => void;
}

export function Footer({ onOpenSafety, onOpenSellerHelp }: FooterProps) {
  return (
    <footer className="w-full bg-white py-6 mt-8 border-t border-[#e6e8eb]">
      <div className="w-full px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[#424656] text-[13px]">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <span className="font-semibold text-[#191c1e]">Marketplace © 2025</span>
          <button
            type="button"
            onClick={onOpenSafety}
            className="hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={onOpenSafety}
            className="hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            Terms
          </button>
          <button
            type="button"
            onClick={onOpenSellerHelp}
            className="hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            Advertising
          </button>
          <button
            type="button"
            onClick={onOpenSellerHelp}
            className="hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            Help Center
          </button>
        </div>
        <div className="text-[#727687] text-[11px] font-bold tracking-[0.02em]">
          Meta Platforms • Community Commerce
        </div>
      </div>
    </footer>
  );
}
