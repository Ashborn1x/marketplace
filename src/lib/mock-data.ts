import type {
  CreateListingInput,
  Listing,
  MarketplaceCategory,
  SelectableCategory,
} from '../types/listing';
import type {
  MessageSubmissionInput,
  SellerMessage,
} from '../types/message';

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  'All Items',
  'Electronics',
  'Vehicles',
  'Property',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Other',
];

export const SELECTABLE_CATEGORIES: SelectableCategory[] = [
  'Electronics',
  'Vehicles',
  'Property',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Other',
];

export const MARKETPLACE_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrBycXvUAJisF56jWwaUwvkWig-Mo-VSROCAWYD2UE9wNJ8i8K6Y8FlOXSLtY3C2n5eZDA7Sn0NGRSgdw3rZqcU0Ie8d0_6Oo14peEkrsUBI4dURvib_FuCTHY4WvI5fWIjESr_vShAEM-6fBwMFEgjV68qLKH4g1RbwYvVhZLoLFVa2gUutz4sPaXmGEa9cNbtTjNtfXqfUe2zuMjQoL2p3-8En3gtI7vA040shF2ws';

export const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA3HUOma_gFVDzjLfSSBPqWdK_IkuDtXtFCeiSQnZoMQqoutjbK8zEnsrk9ZZxtVs2NA8eDxhYsK8iaO_oS7tkX5SOcbpkLYgqqT8BNFT6d7tNEn6D-_DtbHoW7ksSJQ6Xa0W7dgSA7xUkkdbGDUzoOahBvyBhp_hE2yrDhem3ZBHgjChLgx7QIvaThhzDG3Y8uWImHzvewttOT2UjWFhCsw0kACxkiV2oy3bipy6Y';

export const INITIAL_MOCK_LISTINGS: Listing[] = [
  {
    id: 'iphone-13-midnight',
    title: 'iPhone 13',
    description:
      'iPhone 13 128GB Midnight in pristine condition with 92% battery health. Unlocked for all carriers, includes original box and lightning cable. Screen protector applied since day one.',
    price: 18500,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Makati City',
    listedAt: '2 hours ago',
    listedHoursAgo: 2,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVhy40XuX368BKIx3mzRQ5z9K5e5lzhHENmed00c496K0pC7AMErYfUOrtSUfL0nw8X_td_IazOrIenst_TvmUpoEfTfGHeR5L627VeFupAZSsfhrTFeShfmPAe9N03PxmkkW_XXkp7Tlv8FqxT9GVeo-efrhovCZl4ott89AmUMxvT11-gLmy6ZobsvNkQjNVTg7viU4uke8n8KJq4MUGKjf4-1TD90iPoK1trE8',
    ],
    seller: {
      name: 'Elena Santos',
      initials: 'ES',
      email: 'elena.santos@example.com',
      verified: true,
      rating: 4.9,
      reviewCount: 22,
      joinedYear: 2021,
      location: 'Makati City',
      replyTime: 'Typically replies within 30 mins',
    },
  },
  {
    id: 'gaming-laptop-rtx4060',
    title: 'Gaming Laptop',
    description:
      'High-performance RTX 4060 gaming and creator laptop powered by AMD Ryzen 7, 16GB DDR5 RAM, and 1TB NVMe SSD. 165Hz anti-glare display with clean thermals and zero dead pixels.',
    price: 32000,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Bonifacio Global City',
    listedAt: '4 hours ago',
    listedHoursAgo: 4,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQjvfvS9KCsXY3PkZvFPk-VSzmhRfnXgYFM_R-2lv0SpYumz1dW7QJOaqeN51zYU_FhxzwmnHtM9_eHj7pPxMKP7HfUtFZ_QUaBo7oICU7D_dFECrlexLPit_Rgvd5T3jB9IRUU0aqNss09OgVQkNICuL3rGsQuqStGrdQYKf_GBrJvB4Nz45y1W8nqhElIX4NVvz2_9NdtFvJGvEz0apqf_mNM0_R8ujP_l4xO1g',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6BFUGycD0nEgwGPcmptUm5GxHE21J0MNjLwUp-Q93Z01jOpPfAEiEi8TeXNOom-Dj7P1A4voI6rAVMVPW2fFPiYqtKvSr1Slg91BY3QmvBe_gGV0fG016-3Idv9FUSzk7v9VgCL_qH1CZqxvSdH6uAfguc96EYT7h3IiqIznTWJGCERryHhOuwnHqvJb1lt6iw8ySwcYt2twfWHiHrAXeYK6uYNIIkOn_ks3VqW8',
    ],
    seller: {
      name: 'Marcus Tan',
      initials: 'MT',
      email: 'marcus.tan@example.com',
      verified: true,
      rating: 5.0,
      reviewCount: 41,
      joinedYear: 2020,
      location: 'Taguig City',
      replyTime: 'Typically replies within 15 mins',
    },
  },
  {
    id: 'mountain-bike-hybrid',
    title: 'Mountain Bike',
    description:
      'Rugged electric-hybrid mountain bike with fat knobby tires, front suspension fork, disc brakes, and leather saddle. Freshly tuned and ready for city commuting or weekend trails.',
    price: 7500,
    category: 'Sports & Outdoors',
    condition: 'Like New',
    location: 'Quezon City',
    listedAt: 'Listed just now',
    listedHoursAgo: 0.5,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlRBrAKIVeIMf8YEmeJIKsYye6qsZ0Ag4ppFbsjVNexSgj3AiacD_gStl9ppoIt59MZYOcfKtGYN8sRUCfI2zDb7v-jJfs9LcqjJWLqYtQNpXwJyixLvwH0Ay_tMkmhYgYNtQtESqBv8ptk12OWEn6Rs4ZKT_uVDDGYX7GUmYVqJCqVWK4gyj3I8Do9V0vz0-reJV5ZJqM1aSAm5-wrdpdKpagLjdQrl8F3w0Nib4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRFFrRSCvtdqgAFtSDUJ4wgoGDJGPF35RYdDdVwhSNuwKRC1kENIpJAAHkPrL2jMqxZJQtRabug5Iu8kQ_g_ap-LKEoag2TmZvaOgKGwygPi1jh2Yg1228pVtcBTDgg7VgfEC9ONPOonHQFmjbjkybq-4lMtz50fpfqclHHm6qcNoc41vtrHCLdW_BWR_LHpLvJhZo8GD_AyAFlaKBc2oAN5_4M0DUNtwQPYo9g-c',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABccw7oZBDdjtxvbEV7A_ETzW0YQ8obuiMqSCKzCgwW_JUgGvez0kiGCp-RUdVdnRs80f-kzCbSRpRNRn61ke13Ppx2gLBrJL_Mde0tl2EAnh4B7_52-qQEcP9PwJqDekWJaZo4gFBj5NRd_ANFC-P5Y_4RLIM_zgTJ8NMaeLTZMkWEXTRb7d05PgX4XDliBZ8d-UC_mozqyLWCb3Qc-QFzPwH_ZcSzQPRo1CD648',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGZAUBFSaMm-_vi-J_vPi12yH6MSYnP1wE3TvD0FsdmUb6HIloUrZ9WrN2e6Pcwe0_GErmci8xYRnqYRkWc102T3n7PElsdPuKmBHrnyZEpx0AVXt80G9z4OxDJkkdBpwg8XnF9R-StR_GPP2cX40oAPlba9t5ZFWJliTTS8AniUx3bg4UZooY93BCeUEmdFKTHo1OVbKaN8qRKtMACukQWWvKjdtCtN4cHENczq0',
    ],
    seller: {
      name: 'Gabriel Reyes',
      initials: 'GR',
      email: 'gabriel.reyes@example.com',
      verified: true,
      rating: 5.0,
      reviewCount: 24,
      joinedYear: 2021,
      location: 'Quezon City',
      replyTime: 'Typically replies within 15 mins',
    },
  },
  {
    id: 'wooden-study-desk',
    title: 'Wooden Study Desk',
    description:
      'Solid natural pine wood Scandinavian study desk (120cm x 60cm) with two smooth drawers and matching monitor shelf. Clean surface with minimal signs of gentle home use.',
    price: 3200,
    category: 'Home & Garden',
    condition: 'Good',
    location: 'Mandaluyong City',
    listedAt: '3 hours ago',
    listedHoursAgo: 3,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_djwUxifn32eWto9fm6qIrxVvGc_4K62rTZrVCeEKsqsh6mJytOja0m0pjOOy-hFev5_ZiBZAUFfr4PLDKQSE_oLxgVKkcP1jDr0BVrer_PZMKFyZJeZvrg2RaEI59MC5wp5NgYNt60B9w6qhlt4BBo4QoeAP5dxQfIGJKjO_tUmwwke5VnJoKvWkQaxyz5bmcGwcwmyu-dTje6s8Jo5QBNuoLQ5Uu1va0VZXfAs',
    ],
    seller: {
      name: 'Hannah Lim',
      initials: 'HL',
      email: 'hannah.lim@example.com',
      verified: true,
      rating: 4.8,
      reviewCount: 12,
      joinedYear: 2023,
      location: 'Mandaluyong City',
      replyTime: 'Typically replies within 1 hr',
    },
  },
  {
    id: 'wireless-headphones',
    title: 'Wireless Headphones',
    description:
      'Sleek matte charcoal over-ear wireless noise-cancelling headphones with 30-hour battery life, multipoint Bluetooth pairing, and hard travel case included.',
    price: 1500,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Pasig City',
    listedAt: '5 hours ago',
    listedHoursAgo: 5,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCyFzDebmWdNsG2iMEfiQe1v-DdbxVZAJnUMAMvBT_2J0bEaPYKlr708n7PV8udfz-z8tf-d3tzhs_VyFBMfTbm6E5ns0tyjc7oIMdoErpEM6hWj_xXMuk5iiWDZbag5RSaJrBcFAW4sHC9CjJLVfiHBneX8uCN49oD8rRpZR7y9LkHafoV-SCWivQtZQaPHJ6mFO4yMSvdiVIDIUzwnQh9TcKgBAau53_19NYOaOw',
    ],
    seller: {
      name: 'Devon Cruz',
      initials: 'DC',
      email: 'devon.cruz@example.com',
      verified: true,
      rating: 4.9,
      reviewCount: 15,
      joinedYear: 2022,
      location: 'Pasig City',
      replyTime: 'Typically replies within 45 mins',
    },
  },
  {
    id: 'office-chair-ergonomic',
    title: 'Office Chair',
    description:
      'Breathable ergonomic mesh office chair with adjustable lumbar support, 3D armrests, tilt tension lock, and smooth casters. Comfortable for full-day remote work.',
    price: 2800,
    category: 'Home & Garden',
    condition: 'Good',
    location: 'Makati City',
    listedAt: '6 hours ago',
    listedHoursAgo: 6,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvqzf2lPjj-m-JuQvvYFTGZT65jSDbH1uv0dJA0kd2aNaKanDX2rcjz-Zl6QFV_M9sGyj5eT9hBSGzj1XfxWqoUqULItcIIfCCFGwb4oUjOzy3VAZJRHSdIpZL_3kgWZWWNlsxZMDL0T2m6mr5BA8-hEl6s1H_CnVqKZL_MlZM39z9Em53bHutVOpigiFKgB-1gdMr0PYD-C5bkQYJGxPJXNtSWE7I0H9x78dnqyU',
    ],
    seller: {
      name: 'Priya Mendoza',
      initials: 'PM',
      email: 'priya.m@example.com',
      verified: true,
      rating: 5.0,
      reviewCount: 19,
      joinedYear: 2021,
      location: 'Makati City',
      replyTime: 'Typically replies within 1 hr',
    },
  },
  {
    id: 'mechanical-keyboard',
    title: 'Mechanical Keyboard',
    description:
      'Custom 75% gasket-mounted mechanical keyboard with factory-lubed linear switches, dual-tone PBT keycaps, brass rotary knob, and coiled aviator USB-C cable.',
    price: 2000,
    category: 'Electronics',
    condition: 'New',
    location: 'San Juan City',
    listedAt: '1 day ago',
    listedHoursAgo: 24,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrYIQfFWXab8-Z0DKRY6cixcovjXWx0KvMD4JZKDN6LvxOCFt7d4fQnQlg9nNTTCLAy9trXaM6zHpuT9k8tF9TZw2u_A2AAs_HrRlIW0Aminn0sG5fhATNidCZr6cwcmvw0IicTPEjgXjqN6po057uL14Oe8NMmEoEAk-qSqK-nea4a0kb7EoF02ZAnhKOPSdPDig5m2qF7NYbTOo5JRnmUd1rXDgqsGAV0FQgNUc',
    ],
    seller: {
      name: 'Leo Navarro',
      initials: 'LN',
      email: 'leo.navarro@example.com',
      verified: true,
      rating: 5.0,
      reviewCount: 33,
      joinedYear: 2021,
      location: 'San Juan City',
      replyTime: 'Typically replies within 20 mins',
    },
  },
  {
    id: 'digital-camera-4k',
    title: 'Digital Camera',
    description:
      'Mirrorless 4K digital camera with 16-50mm kit zoom lens, lens cap, shoulder strap, and dual batteries. Low shutter count and crisp autofocus.',
    price: 12000,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Manila',
    listedAt: '1 day ago',
    listedHoursAgo: 28,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4LfBtNr929gX-4CX4a7b-c2X1sYU82IJTesiSsnBWOC5URx7XohV4D5Had9tJPNyxvBn4OBeGj1qBdkHC9TcDw20XXmJgvbsfNDqiNJAvWbiXhkEcGGR3HrdbHL3kuTULqlNgrwyk5_UBW5YWcRndsXpMtRVHjOkJwYkJaylUKVA1PJc3zg8v9Hk7NHwTFdTcymAVHmecYH1VPia_MyqGQ3SVTzqwRI-RpBLtmWc',
    ],
    seller: {
      name: 'Claire Bautista',
      initials: 'CB',
      email: 'claire.bautista@example.com',
      verified: true,
      rating: 4.9,
      reviewCount: 27,
      joinedYear: 2019,
      location: 'Manila',
      replyTime: 'Typically replies within 30 mins',
    },
  },
  {
    id: 'nike-running-shoes',
    title: 'Nike Running Shoes',
    description:
      'Lightweight breathable mesh running shoes (US 9.5 / EU 43) in crisp white and cobalt blue. Worn twice indoors on a treadmill; soles and cushioning look brand new.',
    price: 2500,
    category: 'Clothing',
    condition: 'Like New',
    location: 'Ortigas Center',
    listedAt: '8 hours ago',
    listedHoursAgo: 8,
    images: ['/src/assets/images/product_running_shoes_1795093700348.jpg'],
    seller: {
      name: 'Carlo Aquino',
      initials: 'CA',
      email: 'carlo.aquino@example.com',
      verified: true,
      rating: 4.9,
      reviewCount: 14,
      joinedYear: 2022,
      location: 'Pasig City',
      replyTime: 'Typically replies within 1 hr',
    },
  },
  {
    id: 'samsung-monitor-27',
    title: 'Samsung Monitor',
    description:
      '27-inch frameless QHD Samsung IPS monitor with aluminum stand, HDMI & DisplayPort inputs, and eye-saver mode. Ideal for productivity, coding, and photo editing.',
    price: 8000,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Quezon City',
    listedAt: '12 hours ago',
    listedHoursAgo: 12,
    images: ['/src/assets/images/product_samsung_monitor_1795093700659.jpg'],
    seller: {
      name: 'Sophia Villanueva',
      initials: 'SV',
      email: 'sophia.v@example.com',
      verified: true,
      rating: 5.0,
      reviewCount: 18,
      joinedYear: 2021,
      location: 'Quezon City',
      replyTime: 'Typically replies within 30 mins',
    },
  },
  {
    id: 'modern-sofa-3seater',
    title: 'Modern Sofa',
    description:
      'Three-seater minimalist fabric sofa in soft heather gray with tapered solid oak legs. Comfortable high-density cushions, smoke-free home, easy ground-floor pickup.',
    price: 12000,
    category: 'Home & Garden',
    condition: 'Good',
    location: 'Alabang, Muntinlupa',
    listedAt: '2 days ago',
    listedHoursAgo: 48,
    images: ['/src/assets/images/product_modern_sofa_1795093701006.jpg'],
    seller: {
      name: 'Nadia Flores',
      initials: 'NF',
      email: 'nadia.flores@example.com',
      verified: true,
      rating: 4.8,
      reviewCount: 11,
      joinedYear: 2020,
      location: 'Muntinlupa City',
      replyTime: 'Typically replies within 2 hrs',
    },
  },
  {
    id: 'canon-camera-lens',
    title: 'Canon Camera Lens',
    description:
      'Fast f/2.8 telephoto zoom lens with clean optics, zero fungus or haze, smooth focus ring, and front/rear caps included. Sharp across the entire focal range.',
    price: 9500,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Makati City',
    listedAt: '3 days ago',
    listedHoursAgo: 72,
    images: ['/src/assets/images/product_canon_lens_1795093700203.jpg'],
    seller: {
      name: 'Rafael Gomez',
      initials: 'RG',
      email: 'rafael.gomez@example.com',
      verified: true,
      rating: 5.0,
      reviewCount: 31,
      joinedYear: 2020,
      location: 'Makati City',
      replyTime: 'Typically replies within 20 mins',
    },
  },
];

/**
 * Isolated frontend-only listing creation helper.
 * Replace this implementation with a Supabase insert call in Phase 2.
 */
export async function createMockListing(
  input: CreateListingInput
): Promise<Listing> {
  await new Promise((resolve) => setTimeout(resolve, 450));

  const emailLocal = input.sellerEmail.split('@')[0] || 'Seller';
  const displayName = emailLocal
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    id: `listing-${Date.now().toString(36)}`,
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price,
    category: input.category,
    condition: input.condition || 'Like New',
    location: input.location?.trim() || 'Metro Manila',
    listedAt: 'Listed just now',
    listedHoursAgo: 0,
    images: input.images,
    seller: {
      name: displayName || 'Community Seller',
      initials: initials || 'CS',
      email: input.sellerEmail.trim(),
      verified: true,
      rating: 5.0,
      reviewCount: 1,
      joinedYear: 2026,
      location: input.location?.trim() || 'Metro Manila',
      replyTime: 'Typically replies within 1 hr',
    },
    isSessionCreated: true,
  };
}

/**
 * Isolated frontend-only message submission helper.
 * Replace this implementation with a Supabase insert / Edge Function call in Phase 2.
 */
export async function submitMockSellerMessage(
  input: MessageSubmissionInput
): Promise<SellerMessage> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: `msg-${Date.now().toString(36)}`,
    listingId: input.listingId,
    listingTitle: input.listingTitle,
    buyerEmail: input.buyerEmail.trim(),
    sellerEmail: input.sellerEmail,
    message: input.message.trim(),
    sentAt: new Date().toISOString(),
  };
}
