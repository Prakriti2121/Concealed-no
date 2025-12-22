import type { Metadata } from "next";
import { PT_Sans_Narrow, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/molecules/Navbar";
import Container from "@/components/atoms/Container";
import { Toaster } from "react-hot-toast";
import { navSchema } from "./utils/constants";

import { Providers } from "./provider";
import Footer from "@/components/molecules/Footer";
import AgeVerification from "@/components/organisms/AgeVerification";
const ptSansNarrow = PT_Sans_Narrow({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

import { getRobotsConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: {
    default: "ConcealedWines",
    template: "%s | ConcealedWines",
  },
  description: "Concealed Wines - Premium wine importer in Finland",
  icons: {
    icon: "/favicon.ico",
  },
  robots: getRobotsConfig(),
  authors: [{ name: "Concealed Wines" }],
  publisher: "Concealed Wines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no_No" suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
        />
      </head>
      <body
        className={`${ptSansNarrow.variable} ${openSans.variable} antialiased overflow-x-hidden`}
      >
        <AgeVerification />
        <Providers>
          <Container>
            <Navbar />
            {children}
          </Container>
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
