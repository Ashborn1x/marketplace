/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_THREADS,
} from './data/mockListings';
import type {
  DraftListing,
  Listing,
  MessageThread,
  NotificationItem,
  RouteView,
} from './types/marketplace';
import {
  createListing,
  deleteListing,
  fetchListing,
  fetchListings,
  createCheckoutSession,
  submitListingMessage,
  type NewListingInput,
} from './lib/marketplace-api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CreateListingPage } from './components/CreateListingPage';
import { BrowsePage } from './components/BrowsePage';
import { ListingDetailPage } from './components/ListingDetailPage';
import { NotificationsPage } from './components/NotificationsPage';
import { InboxPage } from './components/InboxPage';
import { YourListingsPage } from './components/YourListingsPage';
import { SellerProfilePage } from './components/SellerProfilePage';
import { CheckoutResultPage } from './components/CheckoutResultPage';
import { ToastNotification } from './components/ToastNotification';
import { ListingDetailSkeleton } from './components/ui/LoadingSkeleton';
import {
  InfoModal,
  LocationModal,
  ZoomLightboxModal,
} from './components/Modals';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState<RouteView>('home');
  const [previousRoute, setPreviousRoute] = useState<RouteView>('home');
  const [storageReady, setStorageReady] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [createdListingIds, setCreatedListingIds] = useState<string[]>([]);
  const [listingOwnerTokens, setListingOwnerTokens] = useState<Record<string, string>>({});
  const [savedIds, setSavedIds] = useState<string[]>(['f8ccdd18']);
  const [drafts, setDrafts] = useState<DraftListing[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const detailRequestId = useRef(0);
  const [browseQuery, setBrowseQuery] = useState<string>('laptop');
  const [browseCategory, setBrowseCategory] = useState<string | undefined>(
    undefined
  );
  const [activeDraft, setActiveDraft] = useState<DraftListing | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    INITIAL_THREADS[0]?.id ?? null
  );

  // Location settings
  const [locationLabel, setLocationLabel] = useState('Palo Alto, CA');
  const [radiusMiles, setRadiusMiles] = useState(20);

  // Modals & Toast
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<
    'safety' | 'seller-help' | null
  >(null);
  const [zoomImage, setZoomImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [toastState, setToastState] = useState<{
    visible: boolean;
    title: string;
    listingId?: string;
  }>({ visible: false, title: 'Bike for sale' });
  const [checkoutResult, setCheckoutResult] = useState<'success' | 'cancelled' | null>(null);

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get('checkout');
    if (result === 'success' || result === 'cancelled') setCheckoutResult(result);
  }, []);

  useEffect(() => {
    setCreatedListingIds(loadStored('mp_created_listing_ids_v1', []));
    setListingOwnerTokens(loadStored('mp_listing_owner_tokens_v1', {}));
    setSavedIds(loadStored('mp_saved_v2', ['f8ccdd18']));
    setDrafts(loadStored('mp_drafts_v2', []));
    setThreads(loadStored('mp_threads_v2', INITIAL_THREADS));
    setNotifications(loadStored('mp_notifications_v2', INITIAL_NOTIFICATIONS));
    setStorageReady(true);
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;
    if (!storageReady || (activeRoute !== 'home' && activeRoute !== 'browse')) {
      return;
    }

    setListingsLoading(true);
    setListingsError(null);
    fetchListings(
      activeRoute === 'browse'
        ? { query: browseQuery, category: browseCategory }
        : {}
    )
      .then((loadedListings) => {
        if (!isCurrentRequest) return;
        setListings(
          loadedListings.map((listing) => ({
            ...listing,
            isUserOwned: createdListingIds.includes(listing.id),
          }))
        );
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;
        setListingsError(
          error instanceof Error
            ? error.message
            : 'Listings could not be loaded. Please try again.'
        );
      })
      .finally(() => {
        if (isCurrentRequest) setListingsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [storageReady, activeRoute, browseQuery, browseCategory, createdListingIds]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('mp_created_listing_ids_v1', JSON.stringify(createdListingIds));
    } catch {
      // Ignore storage quota errors.
    }
  }, [storageReady, createdListingIds]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('mp_listing_owner_tokens_v1', JSON.stringify(listingOwnerTokens));
    } catch {
      // Keep the listing usable if browser storage is unavailable.
    }
  }, [storageReady, listingOwnerTokens]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('mp_saved_v2', JSON.stringify(savedIds));
    } catch {
      // Ignore
    }
  }, [storageReady, savedIds]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('mp_drafts_v2', JSON.stringify(drafts));
    } catch {
      // Ignore
    }
  }, [storageReady, drafts]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('mp_threads_v2', JSON.stringify(threads));
    } catch {
      // Ignore
    }
  }, [storageReady, threads]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('mp_notifications_v2', JSON.stringify(notifications));
    } catch {
      // Ignore
    }
  }, [storageReady, notifications]);

  const navigateTo = (route: RouteView) => {
    if (route !== 'listing-detail') detailRequestId.current += 1;
    if (route !== activeRoute && activeRoute !== 'listing-detail') {
      setPreviousRoute(activeRoute);
    }
    if (route !== 'create-listing') {
      setActiveDraft(null);
    }
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectListing = async (listing: Listing) => {
    if (activeRoute !== 'listing-detail') {
      setPreviousRoute(activeRoute);
    }
    const requestId = ++detailRequestId.current;
    setSelectedListing(null);
    setDetailError(null);
    setDetailLoading(true);
    setActiveRoute('listing-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const fetchedListing = await fetchListing(listing.id);
      if (requestId === detailRequestId.current) {
        setSelectedListing({
          ...fetchedListing,
          isUserOwned: createdListingIds.includes(fetchedListing.id),
        });
      }
    } catch (error) {
      if (requestId === detailRequestId.current) {
        setDetailError(
          error instanceof Error
            ? error.message
            : 'This listing could not be loaded.'
        );
      }
    } finally {
      if (requestId === detailRequestId.current) setDetailLoading(false);
    }
  };

  const handleSearchToBrowse = (query: string, category?: string) => {
    setBrowseQuery(query);
    setBrowseCategory(category);
    navigateTo('browse');
  };

  const handlePublishListing = async (input: NewListingInput) => {
    const created = await createListing(input);
    const { ownerToken, ...listing } = created;
    const newListing = {
      ...listing,
      isUserOwned: true,
    };
    setListingOwnerTokens((prev) => ({ ...prev, [newListing.id]: ownerToken }));
    const nextCreatedIds = [...new Set([...createdListingIds, newListing.id])];
    setCreatedListingIds(nextCreatedIds);
    setListings((prev) => [newListing, ...prev]);
    if (activeDraft) {
      setDrafts((prev) => prev.filter((d) => d.id !== activeDraft.id));
      setActiveDraft(null);
    }
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Listing published: ${newListing.title}`,
        body: `Your listing is now live in ${newListing.location} for ${newListing.currency}${newListing.price.toLocaleString('en-US')}.`,
        time: 'Just now',
        type: 'listing',
        read: false,
        listingId: newListing.id,
      },
      ...prev,
    ]);
    setToastState({
      visible: true,
      title: newListing.title,
      listingId: newListing.id,
    });
    navigateTo('home');
  };

  const handleDeleteListing = async (listingId: string) => {
    const ownerToken = listingOwnerTokens[listingId];
    if (!ownerToken) throw new Error('This browser no longer has the owner key for this listing.');
    await deleteListing(listingId, ownerToken);
    setListingOwnerTokens((prev) => {
      const next = { ...prev };
      delete next[listingId];
      return next;
    });
    setCreatedListingIds((prev) => prev.filter((id) => id !== listingId));
    setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    setSavedIds((prev) => prev.filter((id) => id !== listingId));
    if (selectedListing?.id === listingId) setSelectedListing(null);
  };

  const handleSaveDraft = (draft: DraftListing) => {
    setDrafts((prev) => {
      const exists = prev.some((d) => d.id === draft.id);
      if (exists) {
        return prev.map((d) => (d.id === draft.id ? draft : d));
      }
      return [draft, ...prev];
    });
  };

  const handleBuyNow = async (listing: Listing) => {
    const { url } = await createCheckoutSession(listing.id);
    window.location.assign(url);
  };

  const handleSendMessage = async (
    listing: Listing,
    buyerEmail: string,
    text: string
  ): Promise<void> => {
    await submitListingMessage({
      listingId: listing.id,
      buyerEmail,
      message: text,
    });
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    setThreads((prev) => {
      const existing = prev.find((t) => t.listingId === listing.id);
      if (existing) {
        setActiveThreadId(existing.id);
        return prev.map((t) =>
          t.id === existing.id
            ? {
                ...t,
                updatedAt: 'Just now',
                unread: false,
                messages: [
                  ...t.messages,
                  {
                    id: `msg-${Date.now()}`,
                    sender: 'buyer',
                    senderEmail: buyerEmail,
                    text,
                    timestamp: nowLabel,
                  },
                ],
              }
            : t
        );
      }

      const newThread: MessageThread = {
        id: `thread-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: `${listing.currency}${listing.price.toLocaleString('en-US')}`,
        listingImage: listing.images[0],
        sellerName: listing.seller.name,
        sellerInitials: listing.seller.initials,
        sellerEmail: listing.seller.email,
        unread: false,
        updatedAt: 'Just now',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'buyer',
            senderEmail: buyerEmail,
            text,
            timestamp: nowLabel,
          },
        ],
      };
      setActiveThreadId(newThread.id);
      return [newThread, ...prev];
    });
  };

  const handleReplyThread = (threadId: string, text: string) => {
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              updatedAt: 'Just now',
              unread: false,
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: 'buyer',
                  senderEmail: 'buyer@example.com',
                  text,
                  timestamp: nowLabel,
                },
              ],
            }
          : t
      )
    );
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = threads.filter((t) => t.unread).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f4f7] text-[#191c1e]">
      <Header
        activeRoute={activeRoute}
        onNavigate={navigateTo}
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <main className="flex-1 w-full pt-16">
        {checkoutResult && (
          <CheckoutResultPage
            result={checkoutResult}
            onContinue={() => {
              setCheckoutResult(null);
              window.history.replaceState({}, '', '/');
              navigateTo('home');
            }}
          />
        )}
        {!checkoutResult && (
          <>
        {listingsError && (activeRoute === 'home' || activeRoute === 'browse') && (
          <p role="alert" className="max-w-7xl mx-auto px-4 sm:px-8 py-3 text-sm font-semibold text-[#ba1a1a]">
            {listingsError}
          </p>
        )}
        {activeRoute === 'home' && (
          <HomePage
            listings={listings}
            isLoading={listingsLoading}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectListing={handleSelectListing}
            onBuyNow={handleBuyNow}
            onNavigate={navigateTo}
            onSearchToBrowse={handleSearchToBrowse}
            locationLabel={locationLabel}
            radiusMiles={radiusMiles}
            onOpenLocationModal={() => setLocationModalOpen(true)}
            onOpenSafetyModal={() => setInfoModalType('safety')}
            onOpenSellerHelpModal={() => setInfoModalType('seller-help')}
          />
        )}

        {activeRoute === 'create-listing' && (
          <CreateListingPage
            onBack={() => navigateTo(previousRoute)}
            onPublish={handlePublishListing}
            onSaveDraft={handleSaveDraft}
            initialDraft={activeDraft}
          />
        )}

        {activeRoute === 'browse' && (
          <BrowsePage
            listings={listings}
            isLoading={listingsLoading}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectListing={handleSelectListing}
            onBuyNow={handleBuyNow}
            onNavigate={navigateTo}
            onSearchListings={handleSearchToBrowse}
            initialQuery={browseQuery}
            initialCategory={browseCategory}
            locationLabel={locationLabel}
            radiusMiles={radiusMiles}
            onOpenLocationModal={() => setLocationModalOpen(true)}
            onOpenSellerHelpModal={() => setInfoModalType('seller-help')}
            onTriggerSuccessToast={() =>
              setToastState({
                visible: true,
                title: 'Bike for sale',
                listingId: listings[0]?.id,
              })
            }
          />
        )}

        {activeRoute === 'listing-detail' && detailLoading && (
          <ListingDetailSkeleton />
        )}
        {activeRoute === 'listing-detail' && detailError && (
          <p role="alert" className="max-w-7xl mx-auto px-4 sm:px-8 py-6 text-sm font-semibold text-[#ba1a1a]">
            {detailError}
          </p>
        )}
        {activeRoute === 'listing-detail' && selectedListing && (
          <ListingDetailPage
            listing={selectedListing}
            isSaved={savedIds.includes(selectedListing.id)}
            onToggleSave={handleToggleSave}
            onBack={() =>
              navigateTo(
                previousRoute === 'listing-detail' ? 'home' : previousRoute
              )
            }
            onSendMessage={handleSendMessage}
            onOpenInbox={() => navigateTo('inbox')}
            onBuyNow={handleBuyNow}
            onZoomImage={(src, alt) => setZoomImage({ src, alt })}
          />
        )}

        {activeRoute === 'notifications' && (
          <NotificationsPage
            notifications={notifications}
            onMarkAllRead={() =>
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            }
            onClickNotification={(notif) => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
              );
              if (notif.type === 'message') {
                navigateTo('inbox');
              } else if (notif.listingId) {
                const found = listings.find((l) => l.id === notif.listingId);
                if (found) handleSelectListing(found);
              }
            }}
          />
        )}

        {activeRoute === 'inbox' && (
          <InboxPage
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={(threadId) => {
              setActiveThreadId(threadId);
              setThreads((prev) =>
                prev.map((t) =>
                  t.id === threadId ? { ...t, unread: false } : t
                )
              );
            }}
            onReplyThread={handleReplyThread}
            onViewListing={(listingId) => {
              const found = listings.find((l) => l.id === listingId);
              if (found) handleSelectListing(found);
            }}
          />
        )}

        {activeRoute === 'your-listings' && (
          <YourListingsPage
            listings={listings}
            savedIds={savedIds}
            drafts={drafts}
            onSelectListing={handleSelectListing}
            onResumeDraft={(draft) => {
              setActiveDraft(draft);
              navigateTo('create-listing');
            }}
            onDeleteDraft={(draftId) =>
              setDrafts((prev) => prev.filter((d) => d.id !== draftId))
            }
            onCreateNew={() => navigateTo('create-listing')}
            onToggleSave={handleToggleSave}
            onDeleteListing={handleDeleteListing}
            deletableListingIds={Object.keys(listingOwnerTokens)}
          />
        )}

        {activeRoute === 'profile' && <SellerProfilePage />}
          </>
        )}
      </main>

      <Footer
        onOpenSafety={() => setInfoModalType('safety')}
        onOpenSellerHelp={() => setInfoModalType('seller-help')}
      />

      <ToastNotification
        visible={toastState.visible}
        title={toastState.title}
        onViewListing={
          toastState.listingId
            ? () => {
                const found = listings.find(
                  (l) => l.id === toastState.listingId
                );
                setToastState((prev) => ({ ...prev, visible: false }));
                if (found) handleSelectListing(found);
              }
            : undefined
        }
        onDismiss={() => setToastState((prev) => ({ ...prev, visible: false }))}
      />

      <LocationModal
        isOpen={locationModalOpen}
        locationLabel={locationLabel}
        radiusMiles={radiusMiles}
        onSave={(city, radius) => {
          setLocationLabel(city);
          setRadiusMiles(radius);
        }}
        onClose={() => setLocationModalOpen(false)}
      />

      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      <ZoomLightboxModal
        image={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
