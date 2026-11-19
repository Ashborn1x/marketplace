import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  PackageX,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import type { Listing } from '../../types/listing';
import { formatPesoPrice } from '../../lib/utils';
import { SafeImage } from '../SafeImage';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SellerInformation } from './SellerInformation';

interface ListingDetailsProps {
  listing?: Listing;
  onBack: () => void;
  onOpenMessageModal: (listing: Listing) => void;
}

export function ListingDetails({
  listing,
  onBack,
  onOpenMessageModal,
}: ListingDetailsProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Card className="p-8 sm:p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#eceef1] flex items-center justify-center text-[#727687] mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h1 className="text-[22px] font-bold text-[#191c1e] mb-2">
            Listing not found
          </h1>
          <p className="text-[15px] text-[#424656] max-w-md mb-6">
            This item may have been removed or the listing link is invalid.
          </p>
          <Button onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Button>
        </Card>
      </div>
    );
  }

  const activeImage = listing.images[selectedImageIdx] || listing.images[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[#0866ff] hover:text-[#0050cd] font-semibold text-[15px] cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Marketplace</span>
        </button>

        <span className="text-[13px] text-[#727687] hidden sm:inline">
          {listing.category} · {listing.listedAt}
        </span>
      </div>

      {/* Responsive 2-Column Desktop / Stacked Mobile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Product Imagery */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <Card className="overflow-hidden bg-white">
            <div className="relative w-full aspect-[4/3] sm:aspect-square bg-[#eceef1] overflow-hidden">
              <SafeImage
                src={activeImage}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>

          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {listing.images.map((img, idx) => (
                <button
                  key={`${img.slice(0, 20)}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  aria-label={`View photo ${idx + 1}`}
                  className={`aspect-square rounded-lg overflow-hidden bg-white border transition-all cursor-pointer ${
                    idx === selectedImageIdx
                      ? 'ring-2 ring-[#0866ff] border-[#0866ff] opacity-100'
                      : 'border-[#e6e8eb] opacity-75 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={img}
                    alt={`${listing.title} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Safety Tip */}
          <div className="bg-[#eceef1] p-4 rounded-xl flex items-start gap-3 text-[#424656]">
            <ShieldCheck className="w-5 h-5 text-[#0050cd] shrink-0 mt-0.5" />
            <div className="text-[13px] leading-relaxed">
              <span className="font-semibold text-[#191c1e] block">
                Meet safely in public places
              </span>
              Inspect items thoroughly in person before paying, and use well-lit public meeting spots.
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <Badge variant="primary" className="mb-2">
                {listing.category}
              </Badge>
              <h1 className="text-[24px] sm:text-[28px] leading-[32px] font-bold text-[#191c1e] tracking-tight">
                {listing.title}
              </h1>
              <p className="text-[32px] leading-[38px] font-bold text-[#0866ff] mt-1.5 tabular-nums">
                {formatPesoPrice(listing.price)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[#424656]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#727687]" />
                {listing.listedAt}
              </span>
              {listing.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#727687]" />
                  {listing.location}
                </span>
              )}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                size="lg"
                onClick={() => onOpenMessageModal(listing)}
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Seller</span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleShare}
                className="sm:w-auto"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-[#1b7f43]" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Listing</span>
                  </>
                )}
              </Button>
            </div>

            <div className="h-px bg-[#e6e8eb]" />

            {/* Full Description */}
            <div>
              <h2 className="text-[13px] font-bold text-[#424656] uppercase tracking-wide mb-1.5">
                Description
              </h2>
              <p className="text-[15px] text-[#191c1e] leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          </Card>

          <SellerInformation seller={listing.seller} />
        </div>
      </div>
    </div>
  );
}
