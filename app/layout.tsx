import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "@/components/navbar";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Market ",
  description: "Create and sell your NFTs brought to you by RiP3rQ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="min-h-screen">
          <Header />
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
