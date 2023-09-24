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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter();
  const address = useAddress();
  const pathname = usePathname().split("/")[1];

  return (
    <div>
      {!address && (
        <div className="w-full text-xs text-red-500 text-center underline decoration-pink-600/95">
          Zaloguj się, aby w pełni korzystać z serwisu*
        </div>
      )}
      <div className="flex items-center justify-around mt-2">
        {/* Nowa zakładka */}
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="link"
              className={cn(
                "text-xl font-bold hover:underline hover:decoration-pink-600/50",
                pathname === "dodaj" && "underline decoration-pink-600/50"
              )}
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
              className={cn(
                "text-xl font-bold hover:underline hover:decoration-pink-600/50",
                pathname === "" && "underline decoration-pink-600/50"
              )}
              onClick={() => {
                router.push("/");
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
              className={cn(
                "text-xl font-bold hover:underline hover:decoration-pink-600/50",
                pathname === "kolekcje" && "underline decoration-pink-600/50"
              )}
              onClick={() => {
                router.push("/kolekcje");
              }}
            >
              Kolekcje
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 text-center">
            <p className="text-gray-400 text-sm">
              Lista dostępnych kolekcji NFT z których można zdobyć unikalne
              tokeny.
            </p>
          </HoverCardContent>
        </HoverCard>
        {/* Nowa zakładka */}
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="link"
              className={cn(
                "text-xl font-bold hover:underline hover:decoration-pink-600/50",
                pathname === "ekwipunek" && "underline decoration-pink-600/50"
              )}
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
