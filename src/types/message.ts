export interface SellerMessage {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerEmail: string;
  sellerEmail: string;
  message: string;
  sentAt: string;
}

export interface MessageSubmissionInput {
  listingId: string;
  listingTitle: string;
  buyerEmail: string;
  sellerEmail: string;
  message: string;
}
