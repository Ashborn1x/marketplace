import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marketplace — Community Commerce',
  description:
    'Community-driven social commerce marketplace for discovering, listing, and buying local goods.',
  openGraph: {
    title: 'Marketplace — Community Commerce',
    description:
      'Community-driven social commerce marketplace for discovering, listing, and buying local goods.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f2f4f7] text-[#191c1e] antialiased">{children}</body>
    </html>
  );
}
