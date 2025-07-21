
"use client";

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { GoToTopButton } from '@/components/go-to-top-button';
import { AuthProvider } from '@/hooks/use-auth';

// No metadata export from a client component
// export const metadata: Metadata = {
//   title: 'RuralStar',
//   description: 'Empowering rural athletes to showcase their talent.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>RuralStar</title>
        <meta name="description" content="Empowering rural athletes to showcase their talent." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={cn(
          'h-full font-body antialiased',
          'bg-background'
        )}
      >
        <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
            <GoToTopButton />
        </AuthProvider>
      </body>
    </html>
  );
}
