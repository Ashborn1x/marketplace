import { useState } from 'react';
import { HelpCircle, MapPin, ShieldCheck, X } from 'lucide-react';
import { SafeImage } from './SafeImage';

export function LocationModal({
  isOpen,
  locationLabel,
  radiusMiles,
  onSave,
  onClose,
}: {
  isOpen: boolean;
  locationLabel: string;
  radiusMiles: number;
  onSave: (location: string, radius: number) => void;
  onClose: () => void;
}) {
  const [city, setCity] = useState(locationLabel);
  const [radius, setRadius] = useState(radiusMiles);

  if (!isOpen) return null;

  const cities = [
    'Palo Alto, CA',
    'Menlo Park, CA',
    'Mountain View, CA',
    'San Jose, CA',
    'San Francisco, CA',
  ];

  const radii = [5, 10, 20, 40, 60];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0050cd]" />
            <h2 className="text-[18px] font-bold text-[#191c1e]">
              Change Location
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eceef1] flex items-center justify-center text-[#191c1e] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#191c1e] mb-1.5">
              City or Neighborhood
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#eceef1] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {cities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                    city === c
                      ? 'bg-[#dbe1ff] text-[#0050cd]'
                      : 'bg-[#eceef1] text-[#424656]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#191c1e] mb-1.5">
              Search Radius
            </label>
            <div className="grid grid-cols-5 gap-2">
              {radii.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`py-2 rounded-lg text-[13px] font-semibold cursor-pointer tabular-nums ${
                    radius === r
                      ? 'bg-[#0866ff] text-white'
                      : 'bg-[#eceef1] text-[#191c1e] hover:bg-[#e6e8eb]'
                  }`}
                >
                  {r} mi
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSave(city.trim() || 'Palo Alto, CA', radius);
              onClose();
            }}
            className="w-full h-11 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[15px] rounded-lg mt-1 cursor-pointer"
          >
            Apply Location
          </button>
        </div>
      </div>
    </div>
  );
}

export function InfoModal({
  type,
  onClose,
}: {
  type: 'safety' | 'seller-help' | null;
  onClose: () => void;
}) {
  if (!type) return null;

  const isSafety = type === 'safety';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#0050cd]">
              {isSafety ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>
            <h2 className="text-[18px] font-bold text-[#191c1e]">
              {isSafety ? 'Marketplace Safety Guidelines' : 'Seller Help Center'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eceef1] flex items-center justify-center text-[#191c1e] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="space-y-3 text-[14px] text-[#424656] leading-relaxed">
          {isSafety ? (
            <>
              <li className="p-3 bg-[#f2f4f7] rounded-lg">
                <strong className="text-[#191c1e] block">
                  1. Meet in well-lit public places
                </strong>
                Use busy campus plazas, transit centers, or local police Safe Exchange Zones.
              </li>
              <li className="p-3 bg-[#f2f4f7] rounded-lg">
                <strong className="text-[#191c1e] block">
                  2. Inspect before paying
                </strong>
                Test electronics, bikes, and appliances thoroughly in person before handing over funds.
              </li>
              <li className="p-3 bg-[#f2f4f7] rounded-lg">
                <strong className="text-[#191c1e] block">
                  3. Keep messages on Marketplace
                </strong>
                Communicate directly through Marketplace Inbox so your transactions stay documented.
              </li>
            </>
          ) : (
            <>
              <li className="p-3 bg-[#f2f4f7] rounded-lg">
                <strong className="text-[#191c1e] block">
                  Clear photos sell 80% faster
                </strong>
                Upload natural-light shots from multiple angles and highlight any wear honestly.
              </li>
              <li className="p-3 bg-[#f2f4f7] rounded-lg">
                <strong className="text-[#191c1e] block">
                  Price competitively
                </strong>
                Check recent local listings in Browse to set a fair price and note if it is negotiable.
              </li>
              <li className="p-3 bg-[#f2f4f7] rounded-lg">
                <strong className="text-[#191c1e] block">
                  Reply promptly
                </strong>
                Buyers prioritize sellers with quick response times and verified community profiles.
              </li>
            </>
          )}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[14px] rounded-lg mt-5 cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function ZoomLightboxModal({
  image,
  onClose,
}: {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white text-[#191c1e] flex items-center justify-center shadow-lg cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
      <div
        className="max-w-4xl max-h-[85vh] rounded-xl overflow-hidden bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <SafeImage
          src={image.src}
          alt={image.alt}
          className="w-full h-full max-h-[85vh] object-contain"
        />
      </div>
    </div>
  );
}
