import type { Listing } from '../types/marketplace';
import type { MessageRow } from '../types/database';

export interface NewListingInput {
  title: string;
  description: string;
  price: number;
  category: string;
  sellerEmail: string;
  location: string;
  condition: string;
  images: File[];
}

async function readResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | { error?: string };
  if (!response.ok) {
    const message =
      typeof body === 'object' && body && 'error' in body
        ? body.error
        : 'The request could not be completed.';
    throw new Error(message || 'The request could not be completed.');
  }
  return body as T;
}

export async function fetchListings(options: {
  query?: string;
  category?: string;
} = {}): Promise<Listing[]> {
  const params = new URLSearchParams();
  if (options.query?.trim()) params.set('q', options.query.trim());
  if (options.category?.trim()) params.set('category', options.category.trim());
  const query = params.size ? `?${params.toString()}` : '';
  return readResponse<Listing[]>(await fetch(`/api/listings${query}`, { cache: 'no-store' }));
}

export async function fetchListing(id: string): Promise<Listing> {
  return readResponse<Listing>(
    await fetch(`/api/listings/${encodeURIComponent(id)}`, { cache: 'no-store' })
  );
}

export async function createListing(input: NewListingInput): Promise<Listing & { ownerToken: string }> {
  const formData = new FormData();
  const ownerToken = crypto.randomUUID();
  formData.set('title', input.title);
  formData.set('description', input.description);
  formData.set('price', String(input.price));
  formData.set('category', input.category);
  formData.set('seller_email', input.sellerEmail);
  formData.set('location', input.location);
  formData.set('condition', input.condition);
  formData.set('owner_token', ownerToken);
  input.images.forEach((file) => formData.append('images', file));
  return readResponse<Listing & { ownerToken: string }>(
    await fetch('/api/listings', { method: 'POST', body: formData })
  );
}

export async function deleteListing(id: string, ownerToken: string): Promise<void> {
  await readResponse<{ success: true }>(
    await fetch(`/api/listings/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ownerToken }),
    })
  );
}

export async function submitListingMessage(input: {
  listingId: string;
  buyerEmail: string;
  message: string;
}): Promise<void> {
  await readResponse<MessageRow | { success: true }>(
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        listing_id: input.listingId,
        buyer_email: input.buyerEmail,
        message: input.message,
      }),
    })
  );
}

export async function createCheckoutSession(listingId: string, buyerEmail?: string): Promise<{ url: string }> {
  return readResponse<{ url: string }>(
    await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, buyer_email: buyerEmail || undefined }),
    })
  );
}
