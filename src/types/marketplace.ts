export type RouteView =
  | 'home'
  | 'browse'
  | 'create-listing'
  | 'listing-detail'
  | 'notifications'
  | 'inbox'
  | 'profile'
  | 'your-listings';

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export interface SellerInfo {
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
  price: number;
  currency: '$';
  negotiable?: boolean;
  category: string;
  filterChipCategory: string;
  condition: ItemCondition;
  badge?: string;
  location: string;
  distanceMiles: number;
  listedLabel: string;
  listedHoursAgo: number;
  description: string;
  images: string[];
  seller: SellerInfo;
  freeDelivery?: boolean;
  offersShipping?: boolean;
  isUserOwned?: boolean;
  status?: 'active' | 'sold';
  canPurchase?: boolean;
}

export interface DraftListing {
  id: string;
  title: string;
  category: string;
  price: string;
  location: string;
  email: string;
  description: string;
  condition: ItemCondition;
  images: string[];
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  senderEmail: string;
  text: string;
  timestamp: string;
}

export interface MessageThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: string;
  listingImage: string;
  sellerName: string;
  sellerInitials: string;
  sellerEmail: string;
  messages: ChatMessage[];
  unread: boolean;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'listing' | 'message' | 'price' | 'safety';
  read: boolean;
  listingId?: string;
}
