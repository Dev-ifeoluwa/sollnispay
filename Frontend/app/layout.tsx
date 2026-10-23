import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AosInit from "components/AosInit";
import MouseDot from "components/MouseDot";
import PwaProvider from "components/PwaProvider";
// import AosInit from "components/Aosinit";
// import AosInit from "components/AosInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sollnispay - Built for You, Built for Tomorrow",
  description: "Bills and payment app for the future",
  applicationName: "Sollnispay",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Sollnispay", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#1a110b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AosInit />
        <MouseDot />
        {children}
        <PwaProvider />
      </body>
    </html>
  );
}
