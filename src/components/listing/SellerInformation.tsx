import { BadgeCheck, Mail, Star } from 'lucide-react';
import type { SellerProfile } from '../../types/listing';
import { Card } from '../ui/Card';

interface SellerInformationProps {
  seller: SellerProfile;
}

export function SellerInformation({ seller }: SellerInformationProps) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-[#424656] uppercase tracking-wide">
          Seller Information
        </h2>
        <span className="text-[12px] font-semibold text-[#0050cd]">
          {seller.replyTime}
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-[#0866ff] text-white text-[17px] font-bold flex items-center justify-center shrink-0">
          {seller.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[16px] font-bold text-[#191c1e] truncate">
              {seller.name}
            </span>
            {seller.verified && (
              <BadgeCheck
                className="w-[18px] h-[18px] text-[#0866ff] shrink-0"
                aria-label="Verified seller"
              />
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[13px] text-[#424656] mt-0.5">
            <Mail className="w-3.5 h-3.5 text-[#727687] shrink-0" />
            <span className="truncate">{seller.email}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[13px] text-[#727687] mt-1 tabular-nums">
            <span className="inline-flex items-center gap-1 text-[#191c1e] font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {seller.rating.toFixed(1)}
            </span>
            <span>({seller.reviewCount})</span>
            <span aria-hidden="true">·</span>
            <span>Joined {seller.joinedYear}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{seller.location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
