import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE = "https://hy-watches.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "HY Watches / Modern Timepieces",
    template: "%s / HY Watches",
  },
  description:
    "HY Watches builds minimalist automatic and meca-quartz timepieces, water resistance checked to 300m, accuracy regulated and certified before dispatch. Enquiries answered directly on WhatsApp.",
  applicationName: "HY Watches",
  keywords: [
    "automatic watch",
    "dive watch",
    "field watch",
    "meca-quartz chronograph",
    "minimalist timepiece",
    "HY Watches",
  ],
  authors: [{ name: "HY Watches" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE,
    siteName: "HY Watches",
    title: "HY Watches / Modern Timepieces",
    description:
      "Iconic design, advanced technical solutions, high performance. Every reference tested before it leaves the bench.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HY Watches / Modern Timepieces",
    description: "Minimalist automatic and meca-quartz timepieces, tested before dispatch.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
