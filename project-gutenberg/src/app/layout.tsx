import type { Metadata } from "next";
import { Arbutus_Slab } from "next/font/google";
import "./globals.css";

const arbutus = Arbutus_Slab({ 
  variable: "--font-arbutus-slab",
  subsets: ["latin"], 
  weight: "400" ,
});

export const metadata: Metadata = {
  title: "Project Gutenberg",
  description: "Project Gutenberg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${arbutus.className} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
