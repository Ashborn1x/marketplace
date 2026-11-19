import { useState, type FormEvent } from 'react';
import { ExternalLink, MessageCircle, Send } from 'lucide-react';
import type { MessageThread } from '../types/marketplace';
import { SafeImage } from './SafeImage';

interface InboxPageProps {
  threads: MessageThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onReplyThread: (threadId: string, text: string) => void;
  onViewListing: (listingId: string) => void;
}

export function InboxPage({
  threads,
  activeThreadId,
  onSelectThread,
  onReplyThread,
  onViewListing,
}: InboxPageProps) {
  const selectedThread =
    threads.find((t) => t.id === activeThreadId) || threads[0] || null;
  const [replyText, setReplyText] = useState('');

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;
    onReplyThread(selectedThread.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6">
      <div className="mb-4">
        <h1 className="text-[24px] leading-[30px] font-bold text-[#191c1e] tracking-tight">
          Inbox
        </h1>
        <p className="text-[13px] text-[#424656]">
          Direct conversations with buyers and sellers
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="bg-white rounded-xl p-10 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-[#eceef1] flex items-center justify-center mx-auto mb-3 text-[#0050cd]">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h2 className="text-[17px] font-bold text-[#191c1e]">
            No messages yet
          </h2>
          <p className="text-[14px] text-[#424656] mt-1">
            Message a seller on any listing to start a conversation.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
          {/* Threads List */}
          <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#e6e8eb] flex flex-col">
            <div className="p-3.5 border-b border-[#e6e8eb] text-[13px] font-bold text-[#424656]">
              Conversations ({threads.length})
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-[#e6e8eb]">
              {threads.map((thread) => {
                const active = selectedThread?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => onSelectThread(thread.id)}
                    className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                      active ? 'bg-[#dbe1ff]/40' : 'hover:bg-[#f2f4f7]'
                    }`}
                  >
                    <SafeImage
                      src={thread.listingImage}
                      alt={thread.listingTitle}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#eceef1]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[14px] font-bold text-[#191c1e] truncate">
                          {thread.sellerName}
                        </span>
                        <span className="text-[11px] text-[#727687] shrink-0">
                          {thread.updatedAt}
                        </span>
                      </div>
                      <p className="text-[12px] font-semibold text-[#0050cd] truncate">
                        {thread.listingTitle} • {thread.listingPrice}
                      </p>
                      <p className="text-[13px] text-[#424656] truncate mt-0.5">
                        {lastMsg?.text}
                      </p>
                    </div>
                    {thread.unread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0866ff] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active Conversation */}
          {selectedThread && (
            <section className="md:col-span-8 flex flex-col justify-between">
              {/* Listing Banner Header */}
              <div className="p-4 border-b border-[#e6e8eb] flex items-center justify-between gap-3 bg-[#f7f9fc]">
                <div className="flex items-center gap-3 min-w-0">
                  <SafeImage
                    src={selectedThread.listingImage}
                    alt={selectedThread.listingTitle}
                    className="w-11 h-11 rounded-lg object-cover shrink-0 bg-[#eceef1]"
                  />
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-bold text-[#191c1e] truncate">
                      {selectedThread.listingTitle}
                    </h2>
                    <p className="text-[13px] text-[#424656] truncate">
                      {selectedThread.listingPrice} • {selectedThread.sellerName} (
                      {selectedThread.sellerEmail})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onViewListing(selectedThread.listingId)}
                  className="px-3.5 py-2 bg-[#eceef1] hover:bg-[#e6e8eb] text-[#191c1e] text-[12px] font-semibold rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>View Listing</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 bg-white max-h-[380px]">
                {selectedThread.messages.map((msg) => {
                  const isBuyer = msg.sender === 'buyer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${
                        isBuyer ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                          isBuyer
                            ? 'bg-[#0866ff] text-white rounded-br-sm'
                            : 'bg-[#eceef1] text-[#191c1e] rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[11px] text-[#727687] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSend}
                className="p-3.5 border-t border-[#e6e8eb] bg-[#f7f9fc] flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 h-11 px-4 bg-white rounded-full text-[14px] text-[#191c1e] placeholder:text-[#727687] focus:outline-none focus:ring-2 focus:ring-[#0866ff] shadow-sm"
                />
                <button
                  type="submit"
                  className="h-11 px-5 bg-[#0866ff] hover:bg-[#0050cd] text-white font-semibold text-[14px] rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
