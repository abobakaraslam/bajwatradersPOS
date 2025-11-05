import type { Metadata } from "next";
import localFont from "next/font/local";
import HeaderPOSAdmin from "./adminData/HeaderPOSAdmin/page";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";
import FooterCommon from "./FooterCommon/page";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bajwa Traders - POS",
  icons: {
    icon: "/logoPOS.svg", // or "/logo.png", "/favicon.ico"
  },
  description: "Bajwa Traders - POS - created by Abo Bakar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*<link rel="manifest" href="/manifest.json" />*/}
        <meta name="theme-color" content="#007bff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
