import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { metaConfig } from "@/lib/config";
import { FloatingButton } from "@/components/global-components/floating-menu";
import { Toaster } from "sonner";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/providers/query-client";
import { AuthProvider } from "@/providers/auth-provider";
import { DataProvider } from "@/providers/data-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: metaConfig.title,
    template: `%s | ${metaConfig.title}`,
  },
  description: metaConfig.description,
  icons: metaConfig.icon,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <DataProvider>
            <AuthProvider>
              <NuqsAdapter>
                <Toaster richColors position="top-right" />
                {children}
                {/* <FloatingButton /> */}
              </NuqsAdapter>
            </AuthProvider>
          </DataProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
