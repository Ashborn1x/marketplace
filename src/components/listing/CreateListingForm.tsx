import { useState, type FormEvent } from 'react';
import { Loader2, MapPin, Tag } from 'lucide-react';
import type {
  CreateListingInput,
  Listing,
  SelectableCategory,
} from '../../types/listing';
import {
  createMockListing,
  SELECTABLE_CATEGORIES,
} from '../../lib/mock-data';
import { formatPesoPrice, isValidEmail } from '../../lib/utils';
import { ImageUploader } from './ImageUploader';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SafeImage } from '../SafeImage';

interface CreateListingFormProps {
  onCancel: () => void;
  onSuccess: (listing: Listing) => void;
}

interface FormErrors {
  images?: string;
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  sellerEmail?: string;
}

export function CreateListingForm({
  onCancel,
  onSuccess,
}: CreateListingFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<SelectableCategory>('Electronics');
  const [location, setLocation] = useState('Makati City');
  const [sellerEmail, setSellerEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (images.length === 0) {
      nextErrors.images = 'Please upload at least one product photo.';
    }
    if (!title.trim()) {
      nextErrors.title = 'Product title is required.';
    } else if (title.trim().length < 3) {
      nextErrors.title = 'Product title must be at least 3 characters.';
    }
    if (!description.trim()) {
      nextErrors.description = 'Description is required.';
    } else if (description.trim().length < 10) {
      nextErrors.description =
        'Please provide at least 10 characters describing your item.';
    }

    const numericPrice = Number(price);
    if (!price.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      nextErrors.price = 'Please enter a valid positive price.';
    }

    if (!sellerEmail.trim()) {
      nextErrors.sellerEmail = 'Seller email is required.';
    } else if (!isValidEmail(sellerEmail)) {
      nextErrors.sellerEmail = 'Please enter a valid email address.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateListingInput = {
        title,
        description,
        price: Number(price),
        category,
        sellerEmail,
        location,
        images,
      };
      const created = await createMockListing(payload);
      onSuccess(created);
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedPrice = Number(price);
  const previewPriceText =
    !Number.isNaN(parsedPrice) && parsedPrice > 0
      ? formatPesoPrice(parsedPrice)
      : '₱0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form Column */}
      <Card className="lg:col-span-7 p-5 sm:p-7">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <ImageUploader
            images={images}
            onChange={(next) => {
              setImages(next);
              if (next.length > 0 && errors.images) {
                setErrors((prev) => ({ ...prev, images: undefined }));
              }
            }}
            error={errors.images}
          />

          <div className="h-px bg-[#e6e8eb]" />

          <div className="flex flex-col gap-4">
            <h2 className="text-[17px] font-bold text-[#191c1e]">
              Product Information
            </h2>

            {/* Product Title */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="listing-title"
                className="text-[14px] font-semibold text-[#191c1e]"
              >
                Product Title <span className="text-[#ba1a1a]">*</span>
              </label>
              <Input
                id="listing-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title)
                    setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="What are you selling?"
              />
              {errors.title && (
                <p className="text-[13px] font-medium text-[#ba1a1a]">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="listing-description"
                className="text-[14px] font-semibold text-[#191c1e]"
              >
                Description <span className="text-[#ba1a1a]">*</span>
              </label>
              <Textarea
                id="listing-description"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: undefined }));
                }}
                placeholder="Describe your item and its condition."
              />
              {errors.description && (
                <p className="text-[13px] font-medium text-[#ba1a1a]">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="listing-price"
                  className="text-[14px] font-semibold text-[#191c1e]"
                >
                  Price <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[15px] font-bold text-[#191c1e] pointer-events-none">
                    ₱
                  </span>
                  <Input
                    id="listing-price"
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price)
                        setErrors((prev) => ({ ...prev, price: undefined }));
                    }}
                    placeholder="0"
                    className="pl-8 tabular-nums font-semibold"
                  />
                </div>
                {errors.price && (
                  <p className="text-[13px] font-medium text-[#ba1a1a]">
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="listing-category"
                  className="text-[14px] font-semibold text-[#191c1e]"
                >
                  Category <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  id="listing-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as SelectableCategory)
                  }
                  className="flex h-11 w-full rounded-lg border border-[#e0e3e6] bg-[#f7f9fc] px-3.5 py-2 text-[14px] text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866ff] cursor-pointer"
                >
                  {SELECTABLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seller Email & Optional Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="listing-email"
                  className="text-[14px] font-semibold text-[#191c1e]"
                >
                  Seller Email <span className="text-[#ba1a1a]">*</span>
                </label>
                <Input
                  id="listing-email"
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => {
                    setSellerEmail(e.target.value);
                    if (errors.sellerEmail)
                      setErrors((prev) => ({
                        ...prev,
                        sellerEmail: undefined,
                      }));
                  }}
                  placeholder="you@example.com"
                />
                {errors.sellerEmail && (
                  <p className="text-[13px] font-medium text-[#ba1a1a]">
                    {errors.sellerEmail}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="listing-location"
                  className="text-[14px] font-semibold text-[#191c1e]"
                >
                  Location
                </label>
                <Input
                  id="listing-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or neighborhood"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-[#e6e8eb]">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Listing</span>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Live Preview Column */}
      <aside className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[14px] font-bold text-[#191c1e]">
            Live Preview
          </span>
          <span className="text-[12px] text-[#727687]">
            Session preview only
          </span>
        </div>

        <Card className="overflow-hidden">
          <div className="aspect-[4/3] bg-[#eceef1] overflow-hidden">
            {images.length > 0 ? (
              <SafeImage
                src={images[0]}
                alt={title || 'Listing preview'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#727687] p-6 text-center">
                <Tag className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium text-[#424656]">
                  Your product photo will appear here
                </p>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Badge variant="primary" className="mb-1.5">
                  {category}
                </Badge>
                <h3 className="text-[20px] font-bold text-[#191c1e] break-words">
                  {title.trim() || 'What are you selling?'}
                </h3>
                <p className="text-[24px] font-bold text-[#0866ff] mt-0.5 tabular-nums">
                  {previewPriceText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[13px] text-[#727687]">
              <MapPin className="w-4 h-4" />
              <span>{location.trim() || 'Metro Manila'}</span>
              <span aria-hidden="true">·</span>
              <span>Listed just now</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#f2f4f7]">
              <p className="text-[12px] font-bold text-[#424656] uppercase tracking-wide mb-1">
                Description
              </p>
              <p className="text-[14px] text-[#424656] whitespace-pre-wrap leading-relaxed">
                {description.trim() || 'Describe your item and its condition.'}
              </p>
            </div>

            <div className="text-[13px] text-[#727687]">
              Seller contact:{' '}
              <span className="font-medium text-[#191c1e]">
                {sellerEmail.trim() || 'you@example.com'}
              </span>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
