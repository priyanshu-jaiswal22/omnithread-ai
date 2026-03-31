import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'OmniThread AI - Turn 1 Piece of Content Into 10 Platform-Ready Posts',
  description: 'Paste a URL, upload a podcast, or type your idea. OmniThread AI transforms it into perfectly formatted posts for LinkedIn, Twitter, Instagram, and 7 more platforms in under 60 seconds.',
  openGraph: {
    title: 'OmniThread AI',
    description: 'Turn any content into platform-native posts powered by AI',
    url: 'https://omnithread.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniThread AI',
    description: 'Turn any content into platform-native posts powered by AI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-inter antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
