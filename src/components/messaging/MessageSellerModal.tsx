import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send, X } from 'lucide-react';
import type { Listing } from '../../types/listing';
import type { SellerMessage } from '../../types/message';
import { submitMockSellerMessage } from '../../lib/mock-data';
import { formatPesoPrice, isValidEmail } from '../../lib/utils';
import { SafeImage } from '../SafeImage';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface MessageSellerModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: (sentMessage: SellerMessage) => void;
}

export function MessageSellerModal({
  listing,
  isOpen,
  onClose,
  onMessageSent,
}: MessageSellerModalProps) {
  const [buyerEmail, setBuyerEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{
    buyerEmail?: string;
    message?: string;
  }>({});
  const [isSending, setIsSending] = useState(false);
  const [sentResult, setSentResult] = useState<SellerMessage | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSentResult(null);
      setIsSending(false);
    }
  }, [isOpen, listing?.id]);

  if (!isOpen || !listing) return null;

  const validate = () => {
    const nextErrors: { buyerEmail?: string; message?: string } = {};
    if (!buyerEmail.trim()) {
      nextErrors.buyerEmail = 'Buyer email is required.';
    } else if (!isValidEmail(buyerEmail)) {
      nextErrors.buyerEmail = 'Please enter a valid email address.';
    }

    if (!message.trim()) {
      nextErrors.message = 'Please enter a message for the seller.';
    } else if (message.trim().length < 5) {
      nextErrors.message = 'Message must be at least 5 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    try {
      const result = await submitMockSellerMessage({
        listingId: listing.id,
        listingTitle: listing.title,
        buyerEmail,
        sellerEmail: listing.seller.email,
        message,
      });
      setSentResult(result);
      onMessageSent(result);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-seller-title"
    >
      <div
        className="bg-white rounded-xl border border-[#e6e8eb] shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#e6e8eb] flex items-center justify-between">
          <h2
            id="message-seller-title"
            className="text-[18px] font-bold text-[#191c1e]"
          >
            Message Seller
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-[#eceef1] hover:bg-[#e0e3e6] flex items-center justify-center text-[#191c1e] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Summary Strip */}
        <div className="px-5 py-3.5 bg-[#f7f9fc] border-b border-[#e6e8eb] flex items-center gap-3.5">
          <SafeImage
            src={listing.images[0]}
            alt={listing.title}
            className="w-14 h-14 rounded-lg object-cover bg-[#eceef1] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-[#191c1e] truncate">
              {listing.title}
            </h3>
            <p className="text-[16px] font-bold text-[#0866ff] tabular-nums">
              {formatPesoPrice(listing.price)}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {sentResult ? (
            <div className="py-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#e7f7ed] text-[#1b7f43] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-[17px] font-bold text-[#191c1e]">
                Message sent!
              </h3>
              <p className="text-[14px] text-[#424656] mt-1 max-w-sm">
                Your inquiry about <span className="font-semibold">{listing.title}</span> has been sent to {listing.seller.name} ({listing.seller.email}).
              </p>
              <Button onClick={onClose} className="mt-5 w-full sm:w-auto px-6">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="modal-buyer-email"
                  className="text-[14px] font-semibold text-[#191c1e]"
                >
                  Buyer Email <span className="text-[#ba1a1a]">*</span>
                </label>
                <Input
                  id="modal-buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => {
                    setBuyerEmail(e.target.value);
                    if (errors.buyerEmail)
                      setErrors((prev) => ({
                        ...prev,
                        buyerEmail: undefined,
                      }));
                  }}
                  placeholder="Enter your email address"
                />
                {errors.buyerEmail && (
                  <p className="text-[13px] font-medium text-[#ba1a1a]">
                    {errors.buyerEmail}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="modal-message-body"
                  className="text-[14px] font-semibold text-[#191c1e]"
                >
                  Message <span className="text-[#ba1a1a]">*</span>
                </label>
                <Textarea
                  id="modal-message-body"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message)
                      setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Hi! Is this item still available?"
                />
                {errors.message && (
                  <p className="text-[13px] font-medium text-[#ba1a1a]">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
