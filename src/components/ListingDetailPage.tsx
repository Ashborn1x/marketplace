import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  Send,
  Share2,
  Shield,
  ZoomIn,
} from 'lucide-react';
import type { Listing } from '../types/marketplace';
import { SafeImage } from './SafeImage';

interface ListingDetailPageProps {
  listing: Listing;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onBack: () => void;
  onSendMessage: (
    listing: Listing,
    buyerEmail: string,
    text: string
  ) => Promise<void>;
  onOpenInbox: () => void;
  onBuyNow: (listing: Listing) => Promise<void>;
  onZoomImage: (src: string, alt: string) => void;
}

const QUICK_SUGGESTIONS = [
  'Is this available?',
  'Is the price negotiable?',
  'Can I pick it up today?',
];

export function ListingDetailPage({
  listing,
  isSaved,
  onToggleSave,
  onBack,
  onSendMessage,
  onOpenInbox,
  onBuyNow,
  onZoomImage,
}: ListingDetailPageProps) {
  const gallery =
    listing.images.length >= 4
      ? listing.images.slice(0, 4)
      : [
          ...listing.images,
          ...Array.from(
            { length: Math.max(0, 4 - listing.images.length) },
            () => listing.images[0]
          ),
        ];

  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [messageText, setMessageText] = useState(
    'Hi! Is this item still available? Can pick up on campus this afternoon.'
  );
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const activeImage = gallery[activeThumbIdx] || listing.images[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!buyerEmail.trim() || !messageText.trim()) return;
    setSending(true);
    setSubmitError(null);
    try {
      await onSendMessage(listing, buyerEmail.trim(), messageText.trim());
      setSentSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Your message could not be sent. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleBuyNow = async () => {
    setBuying(true);
    setBuyError(null);
    try {
      await onBuyNow(listing);
    } catch (error) {
      setBuyError(error instanceof Error ? error.message : 'Checkout could not be started.');
      setBuying(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-8 py-5">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[#0050cd] font-semibold text-[15px] hover:underline transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Marketplace</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#424656] hidden sm:inline">
            Listed in {listing.category}
          </span>
          <span className="text-[#727687] hidden sm:inline">•</span>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-[#e6e8eb] text-[#191c1e] rounded-full">
            ID: #{listing.id}
          </span>
        </div>
      </div>

      {/* Main 2-Column Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Product Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Featured Image */}
          <div className="relative w-full aspect-[4/3] sm:aspect-square bg-white rounded-xl shadow-sm overflow-hidden group">
            <SafeImage
              src={activeImage}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {listing.seller.verified && (
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[#191c1e] text-[11px] font-bold shadow-sm">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#0050cd]" />
                  <span>Verified Item</span>
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => onZoomImage(activeImage, listing.title)}
              title="Zoom in"
              aria-label="Zoom in on photo"
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur text-[#191c1e] flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-2.5">
            {gallery.map((thumb, idx) => {
              const active = idx === activeThumbIdx;
              return (
                <button
                  key={`${thumb.slice(0, 20)}-${idx}`}
                  type="button"
                  onClick={() => setActiveThumbIdx(idx)}
                  aria-label={`View photo ${idx + 1}`}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-white focus:outline-none transition-all cursor-pointer ${
                    active
                      ? 'ring-2 ring-[#0866ff] opacity-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={thumb}
                    alt={`${listing.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Safety Notice */}
          <div className="bg-[#eceef1] p-3.5 rounded-xl flex items-start gap-3 mt-1 text-[#424656]">
            <Shield className="w-5 h-5 text-[#727687] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#191c1e]">
                Community Safety Tip
              </span>
              <p className="text-[13px] text-[#424656]">
                Always meet in a well-lit, public location on campus or near local police stations for pickup. Test the item thoroughly before paying.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Message Box */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Top Title & Price Block */}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 mb-2 rounded-full bg-[#d8e2ff] text-[#001a41] text-[11px] font-bold">
                  {listing.category}
                </span>
                <h1 className="text-[24px] leading-[30px] font-bold text-[#191c1e] tracking-tight">
                  {listing.title}
                </h1>
                <p className="text-[34px] leading-[40px] text-[#0050cd] font-bold mt-1 tabular-nums">
                  {listing.currency}
                  {listing.price.toLocaleString('en-US')}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleSave(listing.id)}
                  title={isSaved ? 'Saved' : 'Save listing'}
                  aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
                  className={`w-10 h-10 rounded-full bg-[#eceef1] hover:bg-[#e6e8eb] transition-colors flex items-center justify-center cursor-pointer ${
                    isSaved ? 'text-[#0050cd]' : 'text-[#191c1e]'
                  }`}
                >
                  <Bookmark
                    className="w-5 h-5"
                    fill={isSaved ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  title="Share listing"
                  aria-label="Share listing"
                  className="w-10 h-10 rounded-full bg-[#eceef1] hover:bg-[#e6e8eb] transition-colors flex items-center justify-center text-[#191c1e] cursor-pointer"
                >
                  {copiedShare ? (
                    <Check className="w-5 h-5 text-[#1b7f43]" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 pt-1 text-[#424656] text-[13px]">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#727687]" />
                <span>{listing.listedLabel}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#727687]" />
                <span>in {listing.location}</span>
              </div>
            </div>

            {/* Description Box */}
            <div className="mt-1 bg-[#f2f4f7] p-3.5 rounded-lg">
              <h2 className="text-[12px] font-bold text-[#191c1e] uppercase tracking-wide mb-1">
                Description
              </h2>
              <p className="text-[15px] text-[#424656] leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            <div className="bg-white border border-[#dbe1ff] p-4 rounded-xl shadow-sm">
              {listing.status === 'sold' ? (
                <p className="text-[15px] font-bold text-[#727687]">Sold</p>
              ) : listing.canPurchase ? (
                <>
                  <button
                    type="button"
                    onClick={() => void handleBuyNow()}
                    disabled={buying}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 bg-[#0866ff] hover:bg-[#0050cd] disabled:opacity-60 text-white font-semibold text-[15px] rounded-lg cursor-pointer"
                  >
                    {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {buying ? 'Opening Checkout…' : `Buy Now for ${listing.currency}${listing.price.toLocaleString('en-US')}`}
                  </button>
                  {buyError && <p role="alert" className="mt-2 text-[13px] font-semibold text-[#ba1a1a]">{buyError}</p>}
                </>
              ) : (
                <p className="text-[13px] font-semibold text-[#727687]">Seller onboarding is required before this item can be purchased.</p>
              )}
            </div>
          </div>

          {/* Seller Information Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-[#191c1e] uppercase tracking-wide">
                Seller Information
              </h2>
              <span className="text-[11px] font-bold text-[#0058bc] bg-[#eceef1] px-2.5 py-0.5 rounded-full">
                {listing.seller.rating > 0 ? 'Highly Rated' : 'Community Seller'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0866ff] text-white text-[18px] flex items-center justify-center font-bold shrink-0">
                {listing.seller.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] text-[#191c1e] font-bold truncate">
                    {listing.seller.name}
                  </span>
                  {listing.seller.verified && (
                    <BadgeCheck className="w-[18px] h-[18px] text-[#0050cd] shrink-0" />
                  )}
                </div>
                <span className="text-[13px] text-[#424656] truncate">
                  {listing.seller.email}
                </span>
                <div className="flex items-center gap-1 text-[13px] text-[#191c1e] mt-0.5 tabular-nums">
                  {listing.seller.rating > 0 && (
                    <span className="text-amber-500 font-bold">
                      ★ {listing.seller.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="text-[#727687]">
                    {listing.seller.joinedYear > 0
                      ? `• Joined in ${listing.seller.joinedYear} • ${listing.seller.location}`
                      : listing.seller.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Seller Interactive Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-3.5 relative">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 text-[#0050cd]" />
                <h2 className="text-[17px] font-semibold text-[#191c1e]">
                  Message Seller
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#424656]">
                {listing.seller.replyTime}
              </span>
            </div>

            {sentSuccess && (
              <div className="flex items-start gap-2.5 p-3.5 bg-[#e7f7ed] rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-[#1b7f43] shrink-0 mt-0.5" />
                <div className="flex flex-col flex-1">
                  <p className="text-[13px] font-semibold text-[#1b7f43]">
                    Your message was sent to the seller.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenInbox}
                    className="text-[12px] font-bold text-[#1b7f43] underline text-left mt-1 cursor-pointer"
                  >
                    View conversation in Inbox →
                  </button>
                </div>
              </div>
            )}

            {submitError && (
              <p role="alert" className="text-[13px] font-semibold text-[#ba1a1a]">
                {submitError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="buyerEmail"
                  className="font-semibold text-[13px] text-[#191c1e]"
                >
                  Your Email
                </label>
                <input
                  id="buyerEmail"
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 bg-[#eceef1] rounded-lg text-[13px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all"
                />
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#727687]">
                  Quick suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setMessageText(chip)}
                      className="px-3 py-1 bg-[#eceef1] hover:bg-[#dbe1ff] text-[#191c1e] hover:text-[#0050cd] text-[11px] font-bold rounded-full transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="buyerMessage"
                  className="font-semibold text-[13px] text-[#191c1e]"
                >
                  Message
                </label>
                <textarea
                  id="buyerMessage"
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#eceef1] rounded-lg text-[13px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 px-4 bg-[#0866ff] hover:bg-[#0050cd] disabled:opacity-70 text-white font-semibold text-[15px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-[18px] h-[18px]" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] font-semibold text-center text-[#727687]">
              Messages are protected by Community Commerce policies.
            </p>
          </div>
        </div>
      </div>

      {/* Approximate Location Card */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow-sm flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-[17px] font-semibold text-[#191c1e]">
              Approximate Location
            </h2>
            <p className="text-[13px] text-[#424656]">
              {listing.location} • Stanford University Campus Area
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[#0050cd] font-semibold text-[13px]">
            <Navigation className="w-4 h-4" />
            <span>Within {listing.distanceMiles} mile of campus center</span>
          </div>
        </div>

        <div className="w-full h-56 bg-[#eceef1] rounded-xl overflow-hidden flex items-center justify-center relative">
          <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-[#191c1e] font-semibold text-[13px]">
            <MapPin className="w-5 h-5 text-[#0050cd]" />
            <span>General pickup zone • Public meeting spot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
