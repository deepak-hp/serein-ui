import type { Metadata } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import '@serein-ui/react/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serein Next.js consumer',
  description: 'Internal App Router integration fixture for the Serein beta.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-dp-theme="light">
      <body className="dp-theme">{children}</body>
    </html>
  );
}
