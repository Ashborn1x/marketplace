export type MarketplaceCategory =
  | 'All Items'
  | 'Electronics'
  | 'Vehicles'
  | 'Property'
  | 'Clothing'
  | 'Home & Garden'
  | 'Sports & Outdoors'
  | 'Books'
  | 'Other';

export type SelectableCategory = Exclude<MarketplaceCategory, 'All Items'>;

export type ListingCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export interface SellerProfile {
  name: string;
  initials: string;
  email: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  joinedYear: number;
  location: string;
  replyTime: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: SelectableCategory;
  condition: ListingCondition;
  location?: string;
  listedAt: string;
  listedHoursAgo: number;
  images: string[];
  seller: SellerProfile;
  isSessionCreated?: boolean;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  category: SelectableCategory;
  sellerEmail: string;
  location?: string;
  condition?: ListingCondition;
  images: string[];
}
