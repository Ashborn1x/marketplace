'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, ShieldCheck } from 'lucide-react';

export function SellerProfilePage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectStripe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/connect/onboard', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seller_email: email.trim() }),
      });
      const body = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !body.url) throw new Error(body.error || 'Stripe onboarding could not be started.');
      window.location.assign(body.url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Stripe onboarding could not be started.');
      setBusy(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-[#dbe1ff] text-[#0050cd] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#191c1e]">Connect with Stripe</h1>
            <p className="text-[14px] text-[#424656] mt-1">
              Use the email address on your Marketplace listing to start seller onboarding.
            </p>
          </div>
        </div>

        <form onSubmit={(event) => void connectStripe(event)} className="space-y-4">
          <div>
            <label htmlFor="seller-email" className="block text-[13px] font-semibold text-[#191c1e] mb-1.5">
              Seller email
            </label>
            <input
              id="seller-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="The email used on your listing"
              className="w-full h-11 px-3.5 bg-[#eceef1] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
              autoComplete="email"
            />
          </div>
          {error && <p role="alert" className="text-[13px] font-semibold text-[#ba1a1a]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-[#0866ff] hover:bg-[#0050cd] disabled:opacity-50 text-white font-semibold text-[14px] rounded-lg cursor-pointer"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ExternalLink className="w-4 h-4" aria-hidden="true" />}
            {busy ? 'Starting Stripe onboarding…' : 'Connect with Stripe'}
          </button>
          <p className="text-[12px] text-[#727687]">
            Stripe will collect the seller&apos;s identity and payout information on its hosted onboarding page. No Marketplace login is required.
          </p>
        </form>
      </div>
    </section>
  );
}
