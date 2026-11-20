import { CheckCircle2, XCircle } from 'lucide-react';

export function CheckoutResultPage({
  result,
  onContinue,
}: {
  result: 'success' | 'cancelled';
  onContinue: () => void;
}) {
  const success = result === 'success';
  return (
    <section className="max-w-xl mx-auto px-4 sm:px-8 py-16">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        {success ? (
          <CheckCircle2 className="w-14 h-14 text-[#147d3f] mx-auto mb-4" aria-hidden="true" />
        ) : (
          <XCircle className="w-14 h-14 text-[#727687] mx-auto mb-4" aria-hidden="true" />
        )}
        <h1 className="text-[24px] font-bold text-[#191c1e]">
          {success ? 'Payment submitted' : 'Checkout cancelled'}
        </h1>
        <p className="text-[14px] text-[#424656] mt-2">
          {success
            ? 'Your order will be confirmed when Stripe sends the payment webhook.'
            : 'No payment was completed. You can return to the Marketplace and try again.'}
        </p>
        <button type="button" onClick={onContinue} className="mt-6 h-11 px-5 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[14px] rounded-full cursor-pointer">
          Return to Marketplace
        </button>
      </div>
    </section>
  );
}
