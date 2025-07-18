import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MN Group Home Home LLC | Community Residential Services | Richfield, MN",
  description: "Professional community residential services in Richfield, Minnesota by MN Group Home LLC. We provide compassionate, individualized support to help individuals with disabilities live independently in their community.",
  keywords: "MN Group Home LLC, community residential services, CRS, disability services, group home, Richfield MN, Minnesota, independent living",
  authors: [{ name: "MN Group Home LLC" }],
  openGraph: {
    title: "MN Group Home LLC | Community Residential Services | Richfield, MN",
    description: "Professional community residential services in Richfield, Minnesota. Compassionate, individualized support for independent living.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "MN Group Home LLC Logo",
      },
    ],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/logo.png" type="image/png" />
      <link rel="apple-touch-icon" href="/logo.png" />
      <meta property="og:image" content="/logo.png" />
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
