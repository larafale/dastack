import '@/app/globals.css';

import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { env } from '@/env.mjs';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { appConfig } from '@/lib/constant';
import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ReactQueryProvider } from '@/lib/providers';


export const generateMetadata = (): Metadata => ({
  metadataBase: new URL(appConfig.url),
  title: {
    default: appConfig.title,
    template: `%s | ${appConfig.title}`,
  },
  description: appConfig.description,
  keywords: appConfig.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  openGraph: {
    url: appConfig.url,
    title: appConfig.title,
    description: appConfig.description,
    siteName: appConfig.title,
    images: '/opengraph-image.png',
    type: 'website',
    locale: 'en'
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: appConfig.description,
    images: '/opengraph-image.png',
  },
});

const RootLayout = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale();
  return (
    <html suppressHydrationWarning lang={locale}>
      {env.REACT_SCAN === 'true' && (
        <head>
          <script
            async
            src="https://unpkg.com/react-scan/dist/auto.global.js"
          />
        </head>
      )}
      <body
        className={cn('bg-background min-h-svh font-sans antialiased', fonts)}
      >
        <ThemeProvider attribute="class">
          <NuqsAdapter>
            <ReactQueryProvider>
              <NextIntlClientProvider>
                {children}
              </NextIntlClientProvider>
            </ReactQueryProvider>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
