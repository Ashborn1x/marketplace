import { ArrowLeft } from 'lucide-react';
import type { Listing } from '../../types/listing';
import { CreateListingForm } from '../listing/CreateListingForm';

interface CreateListingPageProps {
  onBack: () => void;
  onListingCreated: (listing: Listing) => void;
}

export function CreateListingPage({
  onBack,
  onListingCreated,
}: CreateListingPageProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[#0866ff] hover:text-[#0050cd] font-semibold text-[14px] self-start cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Marketplace</span>
        </button>

        <div>
          <h1 className="text-[28px] sm:text-[32px] leading-[36px] font-bold text-[#191c1e] tracking-tight">
            Create a New Listing
          </h1>
          <p className="text-[15px] text-[#424656] mt-1">
            Share something you&apos;re selling with the community.
          </p>
        </div>
      </div>

      <CreateListingForm
        onCancel={onBack}
        onSuccess={onListingCreated}
      />
    </div>
  );
}
