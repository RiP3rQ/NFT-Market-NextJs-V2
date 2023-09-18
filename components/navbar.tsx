"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import { useAddress } from "@thirdweb-dev/react";

const Navbar = () => {
  const router = useRouter();
  const address = useAddress();

  return (
    <div>
      <div className="flex items-center justify-around mt-2">
        {/* Nowa zakładka */}
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="link"
              className="text-xl font-bold hover:underline hover:decoration-pink-600/50"
              onClick={() => {
                router.push("/dodaj");
              }}
            >
              {address ? (
                "Stwórz NFT"
              ) : (
                <span className="text-red-500">
                  Zaloguj się, aby stworzyć NFT
                </span>
              )}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 text-center">
            <p className="text-gray-400 text-sm">
              Stwórz własne unikalne NFT i sprzedaj je na naszym rynku.
            </p>
          </HoverCardContent>
        </HoverCard>
        {/* Nowa zakładka */}
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="link"
              className="text-xl font-bold hover:underline hover:decoration-pink-600/50"
              onClick={() => {
                router.push("/oferty");
              }}
            >
              Rynek NFT
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 text-center">
            <p className="text-gray-400 text-sm">
              Lista wystawionych NFT na sprzedaż lub licytację.
            </p>
          </HoverCardContent>
        </HoverCard>
        {/* Nowa zakładka */}
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="link"
              className="text-xl font-bold hover:underline hover:decoration-pink-600/50"
              onClick={() => {
                router.push("/kolekcje");
              }}
            >
              Kolekcje
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 text-center">
            <p className="text-gray-400 text-sm">
              Lista kolekcji NFT możliwych do "wykopania".
            </p>
          </HoverCardContent>
        </HoverCard>
        {/* Nowa zakładka */}
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="link"
              className="text-xl font-bold hover:underline hover:decoration-pink-600/50"
              onClick={() => {
                router.push("/ekwipunek");
              }}
            >
              {address ? (
                "Ekwipunek"
              ) : (
                <span className="text-red-500">
                  Zaloguj się, aby zobaczyć ekwipunek
                </span>
              )}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 text-center">
            <p className="text-gray-400 text-sm">
              Lista twoich posiadanych NFT , które możesz sprzedać lub
              przekazać.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Separator className="mt-2" />
    </div>
  );
};

export default Navbar;
