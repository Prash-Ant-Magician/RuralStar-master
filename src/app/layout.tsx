
"use client";

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { GoToTopButton } from '@/components/go-to-top-button';
import { AuthProvider } from '@/hooks/use-auth';
import { Logo } from '@/components/logo';

// No metadata export from a client component
// export const metadata: Metadata = {
//   title: 'TalentTrack',
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
        <title>TalentTrack</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 125%22><g fill=%22%23F97316%22><path d=%22M50,0C22.4,0,0,22.4,0,50c0,35,50,75,50,75s50-40,50-75C100,22.4,77.6,0,50,0z M50,68.1 c-10,0-18.1-8.1-18.1-18.1S40,31.9,50,31.9S68.1,40,68.1,50S60,68.1,50,68.1z%22/%></g><path fill=%22%23FFFFFF%22 d=%22M55.6,38.8c-1.3-0.7-2.8-0.5-4,0.4l-8.4,6.5c-0.6,0.5-1,1.2-1,2v9.3c0,2.2,1.8,4,4,4h1.7c1.1,0,2-0.9,2-2 s-0.9-2-2-2h-1.7c-0.1,0-0.1,0-0.1-0.1c0,0,0,0,0,0v-9.3c0-0.1,0.1-0.2,0.1-0.2l8.4-6.5c0.1-0.1,0.2-0.1,0.2,0 c0.1,0,0.1,0,0.2,0.1l5.9,4.6c0.1,0.1,0.2,0.1,0.3,0.1s0.2,0,0.3-0.1l2.4-1.9c0.2-0.1,0.2-0.4,0.1-0.6l-5.9-4.6 C56.2,38.7,55.8,38.7,55.6,38.8z M48.1,38c1.3,0,2.4-1.1,2.4-2.4s-1.1-2.4-2.4-2.4s-2.4,1.1-2.4,2.4S46.8,38,48.1,38z%22/><g fill=%22%233B5998%22><path d=%22M50,113.3c-13.8,0-25-11.2-25-25c0-2.8,2.2-5,5-5s5,2.2,5,5c0,8.3,6.7,15,15,15s15-6.7,15-15 c0-2.8,2.2-5,5-5s5,2.2,5,5C75,102.1,63.8,113.3,50,113.3z%22/></g></svg>" />
        <meta name="description" content="Bridging Talent & Opportunity." />
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
              {children}
            </div>
            <Toaster />
            <GoToTopButton />
        </AuthProvider>
      </body>
    </html>
  );
}
