import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SKV Global Business Service LLC - Voice-Enabled AI Platform",
  description: "Professional visa, tax, legal, and European business services with voice messaging, document upload, and expert team routing. Global offices in Hungary, London, and Dubai.",
  keywords: "visa services, tax services, legal services, business setup, European company formation, Dubai business, Hungary office, London office, voice messaging, document upload",
  authors: [{ name: "SKV Global Business Service LLC" }],
  creator: "SKV Global Business Service LLC",
  publisher: "SKV Global Business Service LLC",
  robots: "index, follow",
  openGraph: {
    title: "SKV Global Business Service LLC",
    description: "Voice-Enabled AI Business Platform with Global Document Management",
    url: "https://skvbusiness.com",
    siteName: "SKV Global Business Service",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}