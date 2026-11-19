import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Clock,
  CloudUpload,
  FileText,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  PlusCircle,
  Share2,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Star,
  Tag,
  Eye,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import type { DraftListing, ItemCondition, Listing } from '../types/marketplace';
import { BIKE_IMAGES } from '../data/mockListings';
import { SafeImage } from './SafeImage';

interface CreateListingPageProps {
  onBack: () => void;
  onPublish: (listing: Listing) => void;
  onSaveDraft: (draft: DraftListing) => void;
  initialDraft?: DraftListing | null;
}

const CATEGORIES = [
  'Sporting Goods',
  'Bicycles & Accessories',
  'Electronics & Computers',
  'Vehicles & Parts',
  'Home & Garden',
  'Clothing & Shoes',
  'Hobbies & Toys',
];

const CONDITIONS: ItemCondition[] = ['New', 'Like New', 'Good', 'Fair'];

function mapCategoryToChip(cat: string): string {
  if (cat.includes('Electronics')) return 'Electronics';
  if (cat.includes('Vehicles')) return 'Vehicles';
  if (cat.includes('Home')) return 'Home & Garden';
  if (cat.includes('Clothing')) return 'Clothing';
  if (cat.includes('Sporting') || cat.includes('Bicycles')) return 'Sports & Outdoors';
  return 'Other';
}

export function CreateListingPage({
  onBack,
  onPublish,
  onSaveDraft,
  initialDraft,
}: CreateListingPageProps) {
  const [title, setTitle] = useState(initialDraft?.title ?? 'Bike for sale');
  const [category, setCategory] = useState(
    initialDraft?.category ?? 'Sporting Goods'
  );
  const [price, setPrice] = useState(initialDraft?.price ?? '120');
  const [location, setLocation] = useState(
    initialDraft?.location ?? 'Palo Alto, CA'
  );
  const [email, setEmail] = useState(
    initialDraft?.email ?? 'gwientjes@gmail.com'
  );
  const [description, setDescription] = useState(
    initialDraft?.description ?? 'Good condition. Pick up on campus!'
  );
  const [condition, setCondition] = useState<ItemCondition>(
    initialDraft?.condition ?? 'Like New'
  );
  const [images, setImages] = useState<string[]>(
    initialDraft?.images ?? [BIKE_IMAGES.suburban]
  );
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>(
    'desktop'
  );
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (images.length >= 10) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          setImages((prev) => (prev.length < 10 ? [...prev, result] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImageAt = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraftClick = () => {
    onSaveDraft({
      id: initialDraft?.id ?? `draft-${Date.now()}`,
      title: title.trim() || 'Untitled Draft',
      category,
      price,
      location,
      email,
      description,
      condition,
      images,
      updatedAt: 'Saved just now',
    });
    setDraftSavedNotice(true);
    setTimeout(() => setDraftSavedNotice(false), 3000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a listing title.');
      return;
    }
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    if (numericPrice <= 0) {
      setErrorMsg('Please enter a valid price greater than 0.');
      return;
    }
    setErrorMsg(null);

    const newListing: Listing = {
      id: `lst-${Math.random().toString(36).slice(2, 10)}`,
      title: title.trim(),
      price: numericPrice,
      currency: '$',
      negotiable: true,
      category:
        category === 'Electronics & Computers' ? 'Electronics' : category,
      filterChipCategory: mapCategoryToChip(category),
      condition,
      badge: condition,
      location: location.trim() || 'Palo Alto, CA',
      distanceMiles: 1,
      listedLabel: 'Listed just now',
      listedHoursAgo: 0.05,
      description: description.trim() || 'No description provided.',
      images: images.length > 0 ? images : [BIKE_IMAGES.previewCover],
      seller: {
        name: 'Gerrit W.',
        initials: 'G',
        email: email.trim() || 'gwientjes@gmail.com',
        verified: true,
        rating: 5.0,
        reviewCount: 24,
        joinedYear: 2021,
        location: location.trim() || 'Palo Alto, CA',
        replyTime: 'Typically replies in 1 hr',
      },
      freeDelivery: false,
      offersShipping: false,
      isUserOwned: true,
    };

    onPublish(newListing);
  };

  const numericDisplayPrice = price.replace(/[^0-9.]/g, '') || '0';

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
      {/* Top Action Breadcrumb & Mode Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            title="Back to Marketplace"
            className="w-10 h-10 rounded-full bg-[#eceef1] flex items-center justify-center text-[#191c1e] hover:bg-[#e6e8eb] transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-[#727687] text-[11px] font-bold uppercase tracking-wider">
              <span>Marketplace</span>
              <span>/</span>
              <span className="text-[#0050cd]">Sell Item</span>
            </div>
            <h1 className="text-[24px] leading-[30px] font-bold text-[#191c1e] tracking-tight">
              Create Listing
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#eceef1] text-[#191c1e] hover:bg-[#e6e8eb] rounded-full font-semibold text-[13px] transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{draftSavedNotice ? 'Draft Saved' : 'Save as Draft'}</span>
          </button>
          <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-[#e0e3e6] text-[#424656] rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#0866ff] mr-1.5" />
            Auto-syncing preview
          </span>
        </div>
      </div>

      {/* Main Dual Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Listing Form Controls */}
        <section className="lg:col-span-5 bg-white rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="pb-3 mb-4">
            <h2 className="text-[17px] leading-[22px] font-semibold text-[#191c1e]">
              Item Details
            </h2>
            <p className="text-[13px] text-[#424656] mt-0.5">
              Share what you&apos;re selling with buyers in your local community.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#ffdad6] text-[#93000a] text-[13px] font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Photos Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-[15px] text-[#191c1e]">
                  Photos <span className="text-[#ba1a1a]">*</span>
                </label>
                <span className="text-[11px] font-bold text-[#727687] tabular-nums">
                  {images.length} / 10 photos
                </span>
              </div>

              {/* Cover Photo Preview */}
              {images.length > 0 && (
                <div className="space-y-2 mb-2.5">
                  <div className="relative group rounded-xl overflow-hidden bg-[#eceef1] shadow-sm">
                    <SafeImage
                      src={images[0]}
                      alt="Cover photo preview"
                      className="w-full h-52 sm:h-60 object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageAt(0)}
                      title="Remove cover photo"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#2d3133]/85 text-[#eff1f4] text-[11px] font-bold backdrop-blur-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Cover photo</span>
                    </div>
                  </div>

                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(1).map((img, idx) => (
                        <div
                          key={`${img.slice(0, 24)}-${idx}`}
                          className="relative aspect-square rounded-lg overflow-hidden bg-[#eceef1]"
                        >
                          <SafeImage
                            src={img}
                            alt={`Additional photo ${idx + 2}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageAt(idx + 1)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Upload Dropzone */}
              <label className="relative flex flex-col items-center justify-center p-5 rounded-xl bg-[#f2f4f7] hover:bg-[#eceef1] transition-colors cursor-pointer text-center group border border-dashed border-[#c2c6d8]">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <div className="w-11 h-11 rounded-full bg-[#e0e3e6] group-hover:bg-[#dbe1ff] group-hover:text-[#0050cd] transition-colors flex items-center justify-center text-[#424656] mb-1.5">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <span className="text-[13px] font-semibold text-[#0050cd]">
                  Add more photos
                </span>
                <span className="text-[12px] text-[#424656] mt-0.5">
                  JPEG, PNG, or WebP (max 5MB each)
                </span>
              </label>
            </div>

            {/* Title Input */}
            <div>
              <label
                htmlFor="create-title"
                className="block font-semibold text-[15px] text-[#191c1e] mb-1.5"
              >
                Title <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                id="create-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling?"
                className="w-full h-12 px-3.5 bg-[#eceef1] rounded-lg text-[15px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label
                htmlFor="create-category"
                className="block font-semibold text-[15px] text-[#191c1e] mb-1.5"
              >
                Category <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                id="create-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-3.5 bg-[#eceef1] rounded-lg text-[15px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Input */}
            <div>
              <label
                htmlFor="create-price"
                className="block font-semibold text-[15px] text-[#191c1e] mb-1.5"
              >
                Price <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[17px] text-[#191c1e] font-semibold pointer-events-none">
                  $
                </span>
                <input
                  id="create-price"
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-12 pl-8 pr-3.5 bg-[#eceef1] rounded-lg text-[17px] font-semibold text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all tabular-nums"
                />
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label
                htmlFor="create-location"
                className="block font-semibold text-[15px] text-[#191c1e] mb-1.5"
              >
                Location <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-5 h-5 absolute left-3 text-[#727687] pointer-events-none" />
                <input
                  id="create-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State, or Postal Code"
                  className="w-full h-12 pl-10 pr-3.5 bg-[#eceef1] rounded-lg text-[15px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all"
                />
              </div>
            </div>

            {/* Contact Email Input */}
            <div>
              <label
                htmlFor="create-email"
                className="block font-semibold text-[15px] text-[#191c1e] mb-1.5"
              >
                Contact Email <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 absolute left-3 text-[#727687] pointer-events-none" />
                <input
                  id="create-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-12 pl-10 pr-3.5 bg-[#eceef1] rounded-lg text-[15px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="create-description"
                className="block font-semibold text-[15px] text-[#191c1e] mb-1.5"
              >
                Description
              </label>
              <textarea
                id="create-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item, its condition, and other important details."
                className="w-full p-3.5 bg-[#eceef1] rounded-lg text-[15px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] transition-all resize-y"
              />
              <p className="text-[12px] text-[#727687] mt-1 text-right tabular-nums">
                {description.length} characters
              </p>
            </div>

            {/* Item Condition Pills */}
            <div>
              <span className="block font-semibold text-[13px] text-[#191c1e] mb-1.5">
                Item Condition
              </span>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((cond) => {
                  const active = condition === cond;
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#dbe1ff] text-[#0050cd]'
                          : 'bg-[#eceef1] text-[#424656] hover:bg-[#e6e8eb]'
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full h-12 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[15px] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Listing</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full h-11 bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] font-semibold text-[13px] rounded-xl transition-colors cursor-pointer"
              >
                Cancel &amp; Discard
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT COLUMN: Realtime Live Marketplace Preview */}
        <section className="lg:col-span-7 lg:sticky lg:top-20 flex flex-col gap-2.5">
          {/* Preview Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Eye className="w-5 h-5 text-[#0050cd]" />
              <span className="text-[17px] font-semibold text-[#191c1e]">
                Preview
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-[#eceef1] text-[#0050cd]'
                    : 'bg-[#f2f4f7] text-[#424656] hover:bg-[#eceef1]'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-[#eceef1] text-[#0050cd]'
                    : 'bg-[#f2f4f7] text-[#424656] hover:bg-[#eceef1]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>

          {/* Preview Card Wrapper */}
          <div
            className={`w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
              previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''
            }`}
          >
            {/* Hero Image */}
            <div className="relative w-full aspect-[16/10] bg-[#e6e8eb] overflow-hidden">
              {images.length > 0 ? (
                <SafeImage
                  src={images[0]}
                  alt={title || 'Listing Preview Cover'}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#e6e8eb] text-[#424656] p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#eceef1] flex items-center justify-center mb-2 shadow-inner">
                    <ImageIcon className="w-8 h-8 text-[#727687]" />
                  </div>
                  <p className="font-semibold text-[15px] text-[#191c1e]">
                    No photo uploaded yet
                  </p>
                  <p className="text-[13px] text-[#727687] mt-1">
                    Photos make listings 80% more likely to sell
                  </p>
                </div>
              )}

              {/* Condition Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-[#2d3133]/85 text-[#eff1f4] text-[11px] font-bold backdrop-blur-md shadow-sm">
                  {condition}
                </span>
              </div>

              {/* Floating Actions */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="w-9 h-9 rounded-full bg-white/90 text-[#191c1e] flex items-center justify-center shadow-md backdrop-blur-sm">
                  <Bookmark className="w-4 h-4" />
                </span>
                <span className="w-9 h-9 rounded-full bg-white/90 text-[#191c1e] flex items-center justify-center shadow-md backdrop-blur-sm">
                  <Share2 className="w-4 h-4" />
                </span>
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#2d3133]/75 text-[#eff1f4] text-[11px] font-bold backdrop-blur-sm tabular-nums">
                {images.length > 0 ? `1 of ${images.length}` : '0 of 0'}
              </div>
            </div>

            {/* Preview Details */}
            <div className="p-5 sm:p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-[24px] leading-[30px] text-[#191c1e] font-bold tracking-tight break-words">
                  {title.trim() || 'Title'}
                </h2>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-[32px] leading-[38px] text-[#0050cd] font-extrabold tabular-nums">
                    ${numericDisplayPrice}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#eceef1] text-[#424656]">
                    Negotiable
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[13px] text-[#424656]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#727687]" />
                  <span>Listed just now</span>
                  <span>•</span>
                  <span className="text-[#191c1e] font-medium">
                    in {location.trim() || 'Location'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#727687]" />
                  <span>Category:</span>
                  <span className="text-[#191c1e] font-medium">{category}</span>
                </div>
              </div>

              {/* Action CTA Simulation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="h-10 rounded-lg bg-[#0866ff] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </div>
                <div className="h-10 rounded-lg bg-[#eceef1] text-[#191c1e] font-semibold text-[13px] flex items-center justify-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>Make Offer</span>
                </div>
                <div className="h-10 rounded-lg bg-[#eceef1] text-[#191c1e] font-semibold text-[13px] flex items-center justify-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </div>
                <div className="h-10 rounded-lg bg-[#eceef1] text-[#191c1e] font-semibold text-[13px] flex items-center justify-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="text-[17px] font-semibold text-[#191c1e] mb-1">
                  Description
                </h3>
                <p className="text-[15px] text-[#191c1e] whitespace-pre-wrap leading-relaxed">
                  {description.trim() || 'No description provided.'}
                </p>
              </div>

              {/* Seller Information */}
              <div className="pt-2">
                <h3 className="text-[17px] font-semibold text-[#191c1e] mb-2">
                  Seller Information
                </h3>
                <div className="p-3.5 rounded-xl bg-[#f2f4f7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#0058bc] text-white flex items-center justify-center font-bold text-[17px] shadow-sm">
                        G
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0866ff] text-white flex items-center justify-center ring-2 ring-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[15px] text-[#191c1e] block">
                        Gerrit W.
                      </span>
                      <span className="text-[13px] text-[#424656] block truncate max-w-[200px] sm:max-w-none">
                        {email.trim() || 'seller@example.com'}
                      </span>
                      <div className="flex items-center gap-1 text-[#727687] text-[11px] font-semibold mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0058b1]" />
                        <span>Verified Community Member • Joined 2021</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="flex items-center text-[13px]">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-[#191c1e] ml-1 tabular-nums">
                        5.0
                      </span>
                      <span className="text-[#727687] ml-1 tabular-nums">(24)</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#424656] mt-0.5">
                      Typically replies in 1 hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Safe Trading Notice */}
              <div className="p-3.5 rounded-xl bg-[#eceef1] flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#0050cd] mt-0.5 shrink-0" />
                <div className="text-[13px] text-[#424656]">
                  <span className="font-semibold text-[#191c1e] block">
                    Safe Trading Zone Recommended
                  </span>
                  Meet in well-lit public spots like the campus student union or public transit center. Never wire funds ahead of time.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
