import type { Listing } from '../types/marketplace';
import type { ListingRow } from '../types/database';

function categoryChip(category: string): string {
  if (category.includes('Electronics')) return 'Electronics';
  if (category.includes('Vehicles')) return 'Vehicles';
  if (category.includes('Home')) return 'Home & Garden';
  if (category.includes('Clothing')) return 'Clothing';
  if (category.includes('Sporting') || category.includes('Bicycles')) {
    return 'Sports & Outdoors';
  }
  return 'Other';
}

function sellerName(email: string): string {
  const localPart = email.split('@')[0] ?? email;
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function toMarketplaceListing(row: ListingRow): Listing {
  const createdAt = new Date(row.created_at);
  const listedHoursAgo = Math.max(
    0,
    (Date.now() - createdAt.getTime()) / (60 * 60 * 1000)
  );
  const displayedDate =
    listedHoursAgo < 1
      ? 'Listed just now'
      : listedHoursAgo < 24
        ? `Listed ${Math.floor(listedHoursAgo)}h ago`
        : `Listed ${Math.floor(listedHoursAgo / 24)}d ago`;
  const name = sellerName(row.seller_email) || row.seller_email;
  const images = row.image_urls?.length ? row.image_urls : [row.image_url];

  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    currency: '$',
    category: row.category,
    filterChipCategory: categoryChip(row.category),
    condition: row.condition as Listing['condition'],
    location: row.location,
    distanceMiles: 1,
    listedLabel: displayedDate,
    listedHoursAgo,
    description: row.description,
    images,
    seller: {
      name,
      initials: name
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      email: row.seller_email,
      verified: false,
      rating: 0,
      reviewCount: 0,
      joinedYear: 0,
      location: row.location,
      replyTime: 'Replies directly by email',
    },
    status: row.status ?? 'active',
    canPurchase: Boolean((row as ListingRow & { seller_onboarded?: boolean }).seller_onboarded) && (row.status ?? 'active') === 'active',
  };
}
