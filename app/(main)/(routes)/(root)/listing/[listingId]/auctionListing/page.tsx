"use client";

import {
  ChainId,
  MediaRenderer,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
  useAddress,
  useContract,
  useEnglishAuction,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Mumbai } from "@thirdweb-dev/chains";
import toast from "react-hot-toast";
import Countdown from "react-countdown";

const AuctionListing = ({ params }: { params: { listingId: string } }) => {
  const address = useAddress();
  const router = useRouter();
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();
  const [bidAmount, setBidAmount] = useState("");
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
    const notification = toast.loading("Buying process initialized...");

    const txResult = await contract.englishAuctions
      .buyoutAuction(listingId)
      .then((tx) => {
        toast.success("NFT bought successfully", { id: notification });
        router.push("/ekwipunek");
        return tx;
      })
      .catch((error) => {
        toast.error("NFT couldn't be bought", { id: notification });
        console.log(error);
        return error;
      })
      .finally(() => {
        setBidAmount("");
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
        setBidAmount("");
      });

    console.log(txResult);
  };

  console.log(listing);

  // Loader
  if (isLoading)
    return (
      <div>
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  // Error with listing
  if (!listing) {
    return <div>Listing not found!</div>;
  }

  // Actual page
  return (
    <div>
      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>

        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-600 mb-2">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-2">Sprzedawca: </span>
              {listing.creatorAddress.slice(0, 5) +
                "..." +
                listing.creatorAddress.slice(-5)}
            </p>
          </div>

          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Typ sprzedaży:</p>
            <p>Licytacja</p>

            <p className="font-bold">Cena "Kup teraz": </p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValue.displayValue}{" "}
              {listing.buyoutCurrencyValue.symbol}
            </p>

            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold
               text-white rounded-full w-44 py-4 px-10"
            >
              Kup teraz
            </button>
          </div>

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />

            <>
              <p>Current Minimum Bid:</p>
              <p className="font-bold">
                {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
              </p>

              <p>Time Remaining:</p>
              <Countdown
                date={Number(listing.endTimeInSeconds.toString()) * 1000}
              />
            </>

            <hr className="col-span-2" />

            <p className="col-span-2 font-bold">
              Licytuj najlepszą okację{" "}
              <span className="font-bold">[MATIC]</span>
            </p>

            <input
              type="text"
              placeholder={`Minimum: ${minimumNextBid?.displayValue} ${minimumNextBid?.symbol}`}
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.value)}
              value={bidAmount}
            />
            <button
              onClick={makeBid}
              className="bg-red-600 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Licytuj
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuctionListing;
