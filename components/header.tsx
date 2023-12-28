"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import ConnectWalletButton from "@/components/connect-wallet-button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme-button";
import { CurrencyMintButton } from "@/components/currency-mint-button";

const Header = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between px-10 py-2">
        <div
          className="flex flex-col items-center justify-center 
        cursor-pointer"
          onClick={() => router.push("/")}
        >
          <h1
            className="text-3xl font-extrabold underline decoration-pink-600/50 tracking-widest"
            data-test="header_title"
          >
            Rynek NFT
          </h1>
          <h2
            className="font-extralight text-sm text-gray-400"
            data-test="header_subtitle"
          >
            © RIP3RQ
          </h2>
        </div>
        <div className="flex items-center justify-center space-x-3">
          <ModeToggle />
          <CurrencyMintButton />
          <ConnectWalletButton />
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default Header;
