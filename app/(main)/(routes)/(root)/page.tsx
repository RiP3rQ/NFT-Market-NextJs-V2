"use client";

import MarketplaceCard from "@/components/root/marketplace-card";
import { Button } from "@/components/ui/button";
import { useActiveListings } from "@/hooks/use-active-listings";
import { useSortModal } from "@/hooks/use-sort-modal";
import { Filter } from "lucide-react";
import React, { useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

const OfertyPage = () => {
  const { data, onOpen } = useSortModal();

  console.log("Data from sort modal: ");
  console.log(data);

  const { directListings, auctionListings } = useActiveListings();

  if (directListings.length === 0 && auctionListings.length === 0) {
    return (
      <div className=" h-full flex flex-col items-center justify-center">
        <InfinitySpin width="200" color="#4fa94d" />
        <h1 className="text-3xl mr-4">Ładuję</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="p-4 w-full grid grid-cols-2 2xl:grid-cols-4 gap-6 ">
        {directListings?.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            id={listing.id}
            image={listing.asset.image}
            name={listing.asset.name}
            description={listing.asset.description}
            price={listing.currencyValuePerToken.displayValue}
            currency={listing.currencyValuePerToken.symbol}
            listingType="directListing"
          />
        ))}
        {auctionListings?.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            id={listing.id}
            image={listing.asset.image}
            name={listing.asset.name}
            description={listing.asset.description}
            price={listing.buyoutCurrencyValue.displayValue}
            currency={listing.buyoutCurrencyValue.symbol}
            listingType="auctionListing"
          />
        ))}
      </div>
      <div className="fixed bottom-6 left-6 ">
        <Button
          onClick={() => onOpen()}
          className="bg-green-500 text-lg text-white py-2 px-4 flex items-center justify-center"
        >
          <Filter size={20} className="mr-2" />
          <p>Filtruj</p>
        </Button>
      </div>
    </div>
  );
};

export default OfertyPage;
