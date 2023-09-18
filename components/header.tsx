"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ConnectWalletButton from "./connect-wallet-button";
import { useRouter } from "next/navigation";

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
          <h1 className="text-3xl font-extrabold underline decoration-pink-600/50 tracking-widest">
            Rynek NFT
          </h1>
          <h2 className="font-extralight text-sm text-gray-400">© RIP3RQ</h2>
        </div>
        <ConnectWalletButton />
      </div>
      <Separator />
    </div>
  );
};

export default Header;
