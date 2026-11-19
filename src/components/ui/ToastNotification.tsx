import { CheckCircle2, X } from 'lucide-react';

export interface ToastData {
  visible: boolean;
  heading: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastNotificationProps {
  toast: ToastData;
  onDismiss: () => void;
}

export function ToastNotification({
  toast,
  onDismiss,
}: ToastNotificationProps) {
  if (!toast.visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100%-2.5rem)] sm:w-auto bg-white text-[#191c1e] rounded-xl border border-[#e6e8eb] shadow-xl p-4 flex items-center gap-3.5"
    >
      <div className="w-10 h-10 rounded-full bg-[#e7f7ed] flex items-center justify-center text-[#1b7f43] shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#191c1e] leading-tight">
          {toast.heading}
        </p>
        <p className="text-[13px] text-[#424656] truncate mt-0.5">
          {toast.message}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {toast.actionLabel && toast.onAction && (
          <button
            type="button"
            onClick={toast.onAction}
            className="px-3 py-1.5 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-xs rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            {toast.actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#727687] hover:text-[#191c1e] hover:bg-[#eceef1] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
