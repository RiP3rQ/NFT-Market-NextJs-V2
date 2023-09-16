"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <h1 className="text-3xl font-extrabold underline decoration-pink-600/50 tracking-widest">
            Rynek NFT
          </h1>
          <h2 className="font-extralight text-sm text-gray-400">© RIP3RQ</h2>
        </div>
        <Button
          onClick={() => {}}
          className="rounded-full bg-rose-500 px-4 py-2
           text-white text-sm font-bold lg:px-5 lg:py-3 lg:text-base"
        >
          Połącz Portfel
        </Button>
      </div>
      <Separator />
    </div>
  );
};

export default Header;
