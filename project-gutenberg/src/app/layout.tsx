import type { Metadata } from "next";
import { Geist, Geist_Mono, Arbutus_Slab } from "next/font/google";
import "./globals.css";

const arbutus = Arbutus_Slab({ 
  variable: "--font-arbutus-slab",
  subsets: ["latin"], 
  weight: "400" ,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${arbutus.className} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
