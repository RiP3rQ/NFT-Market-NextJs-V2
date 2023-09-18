import { WEB3Provider } from "@/components/providers/thirdweb-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import ToasterProvider from "@/components/providers/toaster-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ToasterProvider />
        <WEB3Provider>
          <ModalProvider />
          {children}
        </WEB3Provider>
      </body>
    </html>
  );
}
