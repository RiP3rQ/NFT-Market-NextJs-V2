import { MediaRenderer } from "@thirdweb-dev/react";
import { Banknote, ClockIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MarketplaceCardProps {
  id: string;
  image: string | null | undefined;
  name: string | number | null | undefined;
  description: string | null | undefined;
  price: string;
  currency: string;
  listingType: "directListing" | "auctionListing";
}

const MarketplaceCard = ({
  id,
  image,
  name,
  description,
  price,
  currency,
  listingType,
}: MarketplaceCardProps) => {
  return (
    <div>
      <Link href={`/listing/${id}`} key={id}>
        <div
          key={id}
          className="flex flex-col card hover:scale-105 translate-all duration-150 ease-out"
        >
          <div className="flex-1 flex flex-col pb-2 items-center">
            <MediaRenderer src={image} className="w-44" />
          </div>

          <div className="pt-2 space-y-4">
            <div>
              <h2 className="truncate text-lg">{name}</h2>
              <hr />
              <p className="truncate text-sm text-gray-600 mt-2">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-between ">
              <div>Cena:</div>
              <div className="font-bold mr-1">
                {price} {currency}
              </div>
            </div>

            <div
              className={`flex items-center space-x-1 justify-end text-xs 
                  border w-fit ml-auto p-2 rounded-lg text-white
                   ${
                     listingType === "directListing"
                       ? "bg-blue-500"
                       : "bg-red-500"
                   }`}
            >
              <p>{listingType === "directListing" ? "Kup Teraz" : "Licytuj"}</p>
              {listingType === "directListing" ? (
                <Banknote className="h-4" />
              ) : (
                <ClockIcon className="h-4" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MarketplaceCard;
