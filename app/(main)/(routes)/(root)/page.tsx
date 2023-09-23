"use client";

import MarketplaceCard from "@/components/root/marketplace-card";
import { Button } from "@/components/ui/button";
import { useActiveListings } from "@/hooks/use-active-listings";
import { useSortModal } from "@/hooks/use-sort-modal";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

const OfertyPage = () => {
  const { data, onOpen } = useSortModal();
  const {
    directListings: dataDirectListings,
    auctionListings: dataAuctionListings,
  } = useActiveListings();
  const [sortCategory, setSortCategory] = useState<string>();
  const [sortDirection, setSortDirection] = useState<string>();
  const [sortedDirectListings, setSortedDirectListings] =
    useState(dataDirectListings);
  const [sortedAuctionListings, setSortedAuctionListings] =
    useState(dataAuctionListings);

  // If object is empty, it means that user didn't sort anything
  // if (Object.keys(data).length > 0) {
  //   ...function
  // }

  useEffect(() => {
    if (!data) return;
    setSortDirection(data.sortDirection);
    setSortCategory(data.sortCategory);
  }, [data]);

  useEffect(() => {
    if (!sortDirection) return;

    sortListingsByDirection();
  }, [sortDirection]);

  // const sortListingsByCategory = (offers) => {
  //   offers.sort((a, b) => {
  //     const displayValueA = parseFloat(a.currencyValue.displayValue);
  //     const displayValueB = parseFloat(b.currencyValue.displayValue);

  //     // Compare in descending order
  //     if (displayValueA < displayValueB) {
  //       return 1;
  //     } else if (displayValueA > displayValueB) {
  //       return -1;
  //     } else {
  //       return 0;
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (!sortDirection) return;

  //   sortListingsByDirection();
  // }, [sortDirection]);

  console.log(dataDirectListings);
  console.log(dataAuctionListings);

  const sortListingsByDirection = () => {
    const listToSortDirectListings = [...dataDirectListings];
    const listToSortAuctionListings = [...dataAuctionListings];

    if (sortDirection === "desc") {
      listToSortDirectListings.sort((a, b) => {
        const displayValueA = parseFloat(a.currencyValuePerToken.displayValue);
        const displayValueB = parseFloat(b.currencyValuePerToken.displayValue);

        // Compare in descending order
        if (displayValueA < displayValueB) {
          return 1;
        } else if (displayValueA > displayValueB) {
          return -1;
        } else {
          return 0;
        }
      });
      setSortedDirectListings(listToSortDirectListings);

      listToSortAuctionListings.sort((a, b) => {
        const displayValueA = parseFloat(a.buyoutCurrencyValue.displayValue);
        const displayValueB = parseFloat(b.buyoutCurrencyValue.displayValue);

        // Compare in descending order
        if (displayValueA < displayValueB) {
          return 1;
        } else if (displayValueA > displayValueB) {
          return -1;
        } else {
          return 0;
        }
      });
      setSortedAuctionListings(listToSortAuctionListings);
    } else if (sortDirection === "asc") {
      listToSortDirectListings.sort((a, b) => {
        const displayValueA = parseFloat(a.currencyValuePerToken.displayValue);
        const displayValueB = parseFloat(b.currencyValuePerToken.displayValue);

        // Compare in descending order
        if (displayValueA < displayValueB) {
          return -1;
        } else if (displayValueA > displayValueB) {
          return 1;
        } else {
          return 0;
        }
      });
      setSortedDirectListings(listToSortDirectListings);

      listToSortAuctionListings.sort((a, b) => {
        const displayValueA = parseFloat(a.buyoutCurrencyValue.displayValue);
        const displayValueB = parseFloat(b.buyoutCurrencyValue.displayValue);

        // Compare in descending order
        if (displayValueA < displayValueB) {
          return -1;
        } else if (displayValueA > displayValueB) {
          return 1;
        } else {
          return 0;
        }
      });

      setSortedAuctionListings(listToSortAuctionListings);
    }
  };

  if (dataDirectListings.length === 0 && dataAuctionListings.length === 0) {
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
        {/* Default listings */}
        {sortCategory === null || sortCategory === undefined
          ? dataDirectListings?.map((listing) => (
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
            ))
          : null}

        {/* Default auction listings */}
        {sortCategory === null || sortCategory === undefined
          ? dataAuctionListings?.map((listing) => (
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
            ))
          : null}

        {/* Sorted directListings after using modal */}
        {sortCategory === "directListing" || sortCategory === "all"
          ? sortedDirectListings?.map((listing) => (
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
            ))
          : null}
        {/* Sorted auctionListings after using modal */}
        {sortCategory === "auctionListing" || sortCategory === "all"
          ? sortedAuctionListings?.map((listing) => (
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
            ))
          : null}
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
