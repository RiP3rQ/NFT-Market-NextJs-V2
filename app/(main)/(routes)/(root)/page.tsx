"use client";

import MarketplaceCard from "@/components/root/marketplace-card";
import { useActiveListings } from "@/hooks/use-active-listings";
import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const OfertyPage = () => {
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
    <div className="flex flex-col h-full w-full">
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
    </div>
  );
};

export default OfertyPage;
