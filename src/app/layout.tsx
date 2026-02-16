import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { metaConfig } from "@/lib/config";
import { FloatingButton } from "@/components/global-components/floating-menu";
import { Toaster } from "sonner";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/providers/query-client";
import { AuthProvider } from "@/providers/auth-provider";
import { DataProvider } from "@/providers/data-provider";
import SignalRProvider from "@/providers/signalr-provider";

import { PreviewcnDevtools } from "@/components/ui/previewcn";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(metaConfig.baseUrl),
  title: {
    default: metaConfig.title,
    template: `%s | ${metaConfig.title}`,
  },
  description: metaConfig.description,
  icons: metaConfig.icon,
  keywords: metaConfig.keywords,
  authors: [{ name: "ThaiFruitz" }],
  creator: "ThaiFruitz",
  publisher: "ThaiFruitz",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: metaConfig.baseUrl,
    title: "ThaiFruitz - Trái Cây Sấy Organic Cao Cấp Việt Nam",
    description: metaConfig.description,
    siteName: "ThaiFruitz",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ThaiFruitz - Trái cây sấy organic cao cấp",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "ThaiFruitz - Trái Cây Sấy Organic",
    description: metaConfig.description,
    images: ["/twitter-image.jpg"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Additional
  alternates: {
    canonical: metaConfig.baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning
        className={`${figtree.variable} antialiased font-sans`}
      >
        {process.env.NODE_ENV === "development" && <PreviewcnDevtools />}
        <QueryProvider>
          <AuthProvider>
            <DataProvider>
              <NuqsAdapter>
                <Toaster
                  richColors
                  position="top-right"
                  duration={2500}
                  closeButton
                />
                <SignalRProvider>{children}</SignalRProvider>
                <FloatingButton />
              </NuqsAdapter>
            </DataProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
