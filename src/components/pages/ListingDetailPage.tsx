import type { Listing } from '../../types/listing';
import { ListingDetails } from '../listing/ListingDetails';

interface ListingDetailPageProps {
  listing?: Listing;
  onBack: () => void;
  onOpenMessageModal: (listing: Listing) => void;
}

export function ListingDetailPage({
  listing,
  onBack,
  onOpenMessageModal,
}: ListingDetailPageProps) {
  return (
    <ListingDetails
      listing={listing}
      onBack={onBack}
      onOpenMessageModal={onOpenMessageModal}
    />
  );
}
