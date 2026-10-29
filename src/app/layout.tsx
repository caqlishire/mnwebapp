import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mngrouphome.org"),
  title: `${brand.name} | Community Residential Services`,
  description:
    `Community residential settings in ${brand.serviceArea}, supporting safety, dignity, independence, and community connection.`,
  openGraph: {
    title: `${brand.name} | Community Residential Services`,
    description:
      `Community residential settings in ${brand.serviceArea}, supporting safety, dignity, independence, and community connection.`,
    url: "https://www.mngrouphome.org",
    siteName: brand.name,
    images: [
      {
        url: "/images/about/mn-group-home-collage.jpg",
        width: 1179,
        height: 680,
        alt: "MN Group Home residential setting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.mngrouphome.org",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: brand.name,
  url: "https://www.mngrouphome.org",
  email: brand.email,
  telephone: brand.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "6524 Humboldt Avenue South",
    addressLocality: "Richfield",
    addressRegion: "MN",
    addressCountry: "US",
  },
  areaServed: brand.serviceArea,
  description:
    "Community residential services and 245D waiver service support in Richfield, Minnesota.",
  image: "https://www.mngrouphome.org/images/about/mn-group-home-collage.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pb-24 md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
