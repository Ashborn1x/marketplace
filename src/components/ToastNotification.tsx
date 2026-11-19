import { CheckCircle2, X } from 'lucide-react';

interface ToastNotificationProps {
  visible: boolean;
  title: string;
  onViewListing?: () => void;
  onDismiss: () => void;
}

export function ToastNotification({
  visible,
  title,
  onViewListing,
  onDismiss,
}: ToastNotificationProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100%-3rem)] sm:w-auto bg-white text-[#191c1e] rounded-xl shadow-xl p-3.5 flex items-center gap-3 border border-[#e6e8eb]"
    >
      <div className="w-10 h-10 rounded-full bg-[#eceef1] flex items-center justify-center text-[#0050cd] shrink-0">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#0050cd] uppercase font-bold tracking-wide">
            State C: Success
          </span>
          <span className="text-[#727687]">•</span>
          <span className="text-[11px] font-semibold text-[#727687]">
            Just now
          </span>
        </div>
        <p className="text-[14px] text-[#191c1e] truncate">
          Your listing “{title}” is now live!
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {onViewListing && (
          <button
            type="button"
            onClick={onViewListing}
            className="px-3 py-1.5 bg-[#0866ff] text-white font-semibold text-[12px] rounded-full hover:bg-[#0050cd] transition-colors cursor-pointer whitespace-nowrap"
          >
            View Listing
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          title="Dismiss"
          aria-label="Dismiss notification"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#727687] hover:text-[#191c1e] hover:bg-[#eceef1] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
