import { Bell, CheckCheck, MessageCircle, ShieldCheck, Tag } from 'lucide-react';
import type { NotificationItem } from '../types/marketplace';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClickNotification: (notif: NotificationItem) => void;
}

export function NotificationsPage({
  notifications,
  onMarkAllRead,
  onClickNotification,
}: NotificationsPageProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-[#0050cd]" />;
      case 'price':
        return <Tag className="w-5 h-5 text-[#0058bc]" />;
      case 'safety':
        return <ShieldCheck className="w-5 h-5 text-[#1b7f43]" />;
      default:
        return <Bell className="w-5 h-5 text-[#0050cd]" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[24px] leading-[30px] font-bold text-[#191c1e] tracking-tight">
            Notifications
          </h1>
          <p className="text-[13px] text-[#424656]">
            {unreadCount > 0
              ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`
              : 'All caught up on Marketplace activity'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#eceef1] text-[#0050cd] font-semibold text-[13px] rounded-full shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-[#e6e8eb] overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-[#424656] text-[15px]">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              type="button"
              onClick={() => onClickNotification(notif)}
              className={`w-full p-4 sm:p-5 flex items-start gap-3.5 text-left transition-colors cursor-pointer ${
                notif.read
                  ? 'bg-white hover:bg-[#f2f4f7]'
                  : 'bg-[#dbe1ff]/25 hover:bg-[#dbe1ff]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#eceef1] flex items-center justify-center shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-bold text-[#191c1e]">
                    {notif.title}
                  </span>
                  <span className="text-[12px] text-[#727687] whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[14px] text-[#424656] mt-0.5 leading-snug">
                  {notif.body}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#0866ff] shrink-0 mt-2" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
