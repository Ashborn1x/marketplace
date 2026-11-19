export const LISTING_CATEGORIES = [
  'Sporting Goods',
  'Bicycles & Accessories',
  'Electronics & Computers',
  'Vehicles & Parts',
  'Home & Garden',
  'Clothing & Shoes',
  'Hobbies & Toys',
] as const;

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_MAX_COUNT = 10;
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isListingCategory(
  category: string
): category is (typeof LISTING_CATEGORIES)[number] {
  return LISTING_CATEGORIES.includes(
    category as (typeof LISTING_CATEGORIES)[number]
  );
}

export function isAllowedImageType(type: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(
    type as (typeof ALLOWED_IMAGE_TYPES)[number]
  );
}

export function detectImageType(
  bytes: Uint8Array
): (typeof ALLOWED_IMAGE_TYPES)[number] | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}
