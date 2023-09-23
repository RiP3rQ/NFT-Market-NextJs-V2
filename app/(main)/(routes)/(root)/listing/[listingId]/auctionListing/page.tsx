"use client";

import {
  MediaRenderer,
  useAddress,
  useContract,
  useEnglishAuction,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Mumbai } from "@thirdweb-dev/chains";
import toast from "react-hot-toast";
import Countdown from "react-countdown";
import { InfinitySpin } from "react-loader-spinner";
import AttributeBlock from "@/components/root/attribute-block";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const AuctionListing = ({ params }: { params: { listingId: string } }) => {
  const address = useAddress();
  const router = useRouter();
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();
  const [bidAmount, setBidAmount] = useState<number>();
  const { listingId } = params;

  // Marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
    "marketplace-v3"
  );

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();

  // Listing data
  const { data: listing, isLoading } = useEnglishAuction(contract, listingId);

  // Getting next minimum bid FUNCTION
  const fetchMinNextBid = async () => {
    if (!listingId || !contract) return;

    await contract.englishAuctions
      .getMinimumNextBid(listingId)
      .then((minBid) => {
        setMinimumNextBid({
          displayValue: minBid.displayValue,
          symbol: minBid.symbol,
        });
      });
  };

  // Getting next minimum bid
  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    fetchMinNextBid();
  }, [listingId, listing, contract]);

  // Buy Now NFT function
  const buyNft = async () => {
    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      return;
    }

    if (!listingId || !contract || !listing) return;

    // Toast notification to say buying NFT
    const notification = toast.loading("Rozpocząto proces kupna...");

    const txResult = await contract.englishAuctions
      .buyoutAuction(listingId)
      .then((tx) => {
        toast.success("Zakupiono pomyślnie!", { id: notification });
        router.push("/ekwipunek");
        return tx;
      })
      .catch((error) => {
        toast.error("UPS! Coś poszło nie tak.", { id: notification });
        console.log(error);
        return error;
      })
      .finally(() => {
        setBidAmount(0);
      });

    console.log(txResult);
  };

  // Make an offer function
  const makeBid = async () => {
    // Toast notification to making offer
    const notification = toast.loading("Making bid...");

    if (!contract || !listing || !bidAmount) return;

    console.log(bidAmount);

    console.log(listing);

    const txResult = await contract.englishAuctions
      .makeBid(listingId, bidAmount)
      .then((tx) => {
        toast.success("Bid send", { id: notification });
        return tx;
      })
      .catch((error) => {
        toast.error("Bid couldn't be send", { id: notification });
        console.log(error);
        return error;
      })
      .finally(() => {
        setBidAmount(0);
      });

    console.log(txResult);
  };

  console.log(listing);

  // Loader
  if (isLoading)
    return (
      <div className=" h-full flex flex-col items-center justify-center">
        <InfinitySpin width="200" color="#4fa94d" />
        <h1 className="text-3xl mr-4">Ładuję</h1>
      </div>
    );

  // Error with listing
  if (!listing) {
    return (
      <div className="flex items-center justify-center">
        Nie znaleziono NFT!
      </div>
    );
  }

  // Actual page
  return (
    <div className="flex flex-col h-full w-full pt-4">
      <main className="w-full lg:max-w-7xl p-2 flex flex-col justify-center items-center space-x-5 pr-10 lg:flex-row lg:mx-auto lg:items-start lg:justify-start">
        <aside className="w-full lg:w-5/12 lg:mx-0 pb-20 lg:pb-0">
          {/* Image */}
          <div className="border mx-auto flex items-center justify-center">
            <MediaRenderer src={listing.asset.image} />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div>
              <p className="font-bold text-lg">Opis:</p>
              <p className="text-gray-600 mb-2">{listing.asset.description}</p>
            </div>
            {/* Attributes if exist */}
            {listing.asset.attributes && (
              <>
                <Separator />
                <div>
                  <p className="font-bold text-lg">Cechy:</p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-2">
                    {
                      // @ts-ignore
                      listing.asset.attributes?.map((attribute) => (
                        <AttributeBlock
                          key={attribute.trait_type}
                          trait_type={attribute.trait_type}
                          value={attribute.value}
                        />
                      ))
                    }
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        <section className="w-full space-y-5 pb-20 lg:w-7/12 lg:mx-0 lg:pb-0">
          <h1 className="text-5xl font-bold">{listing.asset.name}</h1>
          <Separator />
          <p className="flex items-center justify-center text-xs sm:text-base">
            <UserCircleIcon className="h-5" />
            <span className="font-bold pr-2">Sprzedawca: </span>
            {listing.creatorAddress.slice(0, 5) +
              "..." +
              listing.creatorAddress.slice(-5)}
          </p>

          <Separator />

          <div className="grid grid-cols-2 gap-y-2">
            <p className="font-bold">Typ sprzedaży:</p>
            <p>Licytacja</p>

            <p className="font-bold">Cena "Kup teraz": </p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValue.displayValue}{" "}
              {listing.buyoutCurrencyValue.symbol}
            </p>

            <Button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold
               text-white rounded-full w-44 py-4 px-10"
            >
              Kup teraz
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-y-2">
            <p className="font-bold">Obecnie najmniejsze podbicie:</p>
            <p className="">
              {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
            </p>

            <p className="font-bold">Pozostały czas:</p>
            <p className="text-xl font-bold">
              <Countdown
                date={Number(listing.endTimeInSeconds.toString()) * 1000}
              />
            </p>
          </div>

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <p className="col-span-2 font-bold">
              Licytuj najlepszą okację{" "}
              <span className="font-bold">[RIPERS]</span>
            </p>

            <input
              type="number"
              placeholder={`Minimum: ${minimumNextBid?.displayValue} ${minimumNextBid?.symbol}`}
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.valueAsNumber)}
              value={bidAmount}
            />
            <Button
              onClick={() => makeBid()}
              className="bg-green-600 font-bold text-white rounded-full w-44 py-4 px-10 "
            >
              Licytuj
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuctionListing;
