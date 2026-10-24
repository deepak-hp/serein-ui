import type { Metadata } from 'next';
import '@serein-ui/react/fonts.css';
import '@serein-ui/react/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serein Next.js consumer',
  description: 'Internal App Router integration fixture for the Serein beta.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body className="sr-theme">{children}</body>
    </html>
  );
}
