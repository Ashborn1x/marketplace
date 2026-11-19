import { useState } from 'react';
import { Bookmark, FileText, Heart, Plus, Trash2 } from 'lucide-react';
import type { DraftListing, Listing } from '../types/marketplace';
import { SafeImage } from './SafeImage';

interface YourListingsPageProps {
  listings: Listing[];
  savedIds: string[];
  drafts: DraftListing[];
  onSelectListing: (listing: Listing) => void;
  onResumeDraft: (draft: DraftListing) => void;
  onDeleteDraft: (draftId: string) => void;
  onCreateNew: () => void;
  onToggleSave: (id: string) => void;
}

export function YourListingsPage({
  listings,
  savedIds,
  drafts,
  onSelectListing,
  onResumeDraft,
  onDeleteDraft,
  onCreateNew,
  onToggleSave,
}: YourListingsPageProps) {
  const [tab, setTab] = useState<'selling' | 'saved' | 'drafts'>('selling');

  const userListings = listings.filter((l) => l.isUserOwned);
  const savedListings = listings.filter((l) => savedIds.includes(l.id));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[24px] leading-[30px] font-bold text-[#191c1e] tracking-tight">
            Your Marketplace
          </h1>
          <p className="text-[13px] text-[#424656]">
            Manage your active listings, saved items, and unpublished drafts
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 h-10 px-5 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[14px] rounded-full shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => setTab('selling')}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
            tab === 'selling'
              ? 'bg-[#dbe1ff] text-[#0050cd]'
              : 'bg-white text-[#424656] hover:bg-[#e6e8eb]'
          }`}
        >
          Active Listings ({userListings.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('saved')}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
            tab === 'saved'
              ? 'bg-[#dbe1ff] text-[#0050cd]'
              : 'bg-white text-[#424656] hover:bg-[#e6e8eb]'
          }`}
        >
          Saved Items ({savedListings.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('drafts')}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
            tab === 'drafts'
              ? 'bg-[#dbe1ff] text-[#0050cd]'
              : 'bg-white text-[#424656] hover:bg-[#e6e8eb]'
          }`}
        >
          Drafts ({drafts.length})
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'selling' && (
        <>
          {userListings.length === 0 ? (
            <div className="bg-white rounded-xl p-10 shadow-sm text-center">
              <Bookmark className="w-10 h-10 text-[#0050cd] mx-auto mb-2.5 opacity-80" />
              <h2 className="text-[17px] font-bold text-[#191c1e]">
                You haven&apos;t published any listings yet
              </h2>
              <p className="text-[14px] text-[#424656] mt-1 mb-4">
                Create a listing to reach buyers in your local campus and city community.
              </p>
              <button
                type="button"
                onClick={onCreateNew}
                className="px-5 py-2.5 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[14px] rounded-full cursor-pointer"
              >
                Create Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {userListings.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onSelectListing(item)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-square bg-[#eceef1] overflow-hidden">
                    <SafeImage
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3.5">
                    <div className="text-[17px] font-bold text-[#191c1e] tabular-nums">
                      {item.currency}
                      {item.price.toLocaleString('en-US')}
                    </div>
                    <h3 className="text-[15px] text-[#191c1e] truncate mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[#727687] mt-1">
                      {item.listedLabel} • {item.location}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'saved' && (
        <>
          {savedListings.length === 0 ? (
            <div className="bg-white rounded-xl p-10 shadow-sm text-center">
              <Heart className="w-10 h-10 text-[#727687] mx-auto mb-2.5" />
              <h2 className="text-[17px] font-bold text-[#191c1e]">
                No saved items yet
              </h2>
              <p className="text-[14px] text-[#424656] mt-1">
                Tap the heart icon on any Marketplace listing to bookmark it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {savedListings.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onSelectListing(item)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-square bg-[#eceef1] overflow-hidden">
                    <SafeImage
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-[#ba1a1a] flex items-center justify-center shadow cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-3.5">
                    <div className="text-[17px] font-bold text-[#191c1e] tabular-nums">
                      {item.currency}
                      {item.price.toLocaleString('en-US')}
                    </div>
                    <h3 className="text-[15px] text-[#191c1e] truncate mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[#727687] mt-1">
                      {item.location}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'drafts' && (
        <>
          {drafts.length === 0 ? (
            <div className="bg-white rounded-xl p-10 shadow-sm text-center">
              <FileText className="w-10 h-10 text-[#727687] mx-auto mb-2.5" />
              <h2 className="text-[17px] font-bold text-[#191c1e]">
                No saved drafts
              </h2>
              <p className="text-[14px] text-[#424656] mt-1">
                When creating a listing, click “Save as Draft” to continue later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3.5"
                >
                  <SafeImage
                    src={draft.images[0]}
                    alt={draft.title}
                    className="w-16 h-16 rounded-lg object-cover bg-[#eceef1] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-[#191c1e] truncate">
                      {draft.title}
                    </h3>
                    <p className="text-[13px] text-[#424656] truncate">
                      ${draft.price || '0'} • {draft.category}
                    </p>
                    <p className="text-[11px] text-[#727687] mt-0.5">
                      {draft.updatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onResumeDraft(draft)}
                      className="px-3 py-1.5 bg-[#dbe1ff] text-[#0050cd] text-[12px] font-semibold rounded-lg cursor-pointer"
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDraft(draft.id)}
                      aria-label="Delete draft"
                      className="p-1.5 text-[#727687] hover:text-[#ba1a1a] rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
