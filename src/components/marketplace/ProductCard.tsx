import { Heart } from 'lucide-react';
import type { Listing } from '../../types/listing';
import { formatPesoPrice } from '../../lib/utils';
import { SafeImage } from '../SafeImage';

interface ProductCardProps {
  listing: Listing;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onClick: (listing: Listing) => void;
}

export function ProductCard({
  listing,
  isSaved = false,
  onToggleSave,
  onClick,
}: ProductCardProps) {
  return (
    <article
      onClick={() => onClick(listing)}
      className="group bg-white rounded-xl border border-[#e6e8eb] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="relative w-full aspect-square bg-[#eceef1] overflow-hidden">
        <SafeImage
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(listing.id);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors cursor-pointer ${
              isSaved
                ? 'text-[#ba1a1a]'
                : 'text-[#191c1e] hover:text-[#ba1a1a]'
            }`}
          >
            <Heart
              className="w-4 h-4"
              fill={isSaved ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="text-[17px] leading-[22px] font-bold text-[#191c1e] tabular-nums">
            {formatPesoPrice(listing.price)}
          </div>
          <h3 className="text-[15px] leading-[20px] font-semibold text-[#191c1e] line-clamp-1 mt-0.5 group-hover:text-[#0866ff] transition-colors">
            {listing.title}
          </h3>
        </div>

        <div className="text-[13px] leading-[18px] text-[#727687] flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[#424656] truncate">
            <span>{listing.category}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.listedAt}</span>
          </div>
          {listing.location && (
            <p className="truncate text-[#727687]">{listing.location}</p>
          )}
        </div>
      </div>
    </article>
  );
}
