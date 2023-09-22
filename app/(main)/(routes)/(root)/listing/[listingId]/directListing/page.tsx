"use client";

import {
  ChainId,
  MediaRenderer,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
  useAddress,
  useContract,
  useDirectListing,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Mumbai } from "@thirdweb-dev/chains";
import toast from "react-hot-toast";

const DirectListing = ({ params }: { params: { listingId: string } }) => {
  const address = useAddress();
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState("");
  const [offers, setOffers] = useState<any[]>([]);
  const { listingId } = params;

  // Marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
    "marketplace-v3"
  );

  // Marketplace contract actions
  useEffect(() => {
    if (!contract) return;

    const getOffers = async () => {
      const offers = await contract?.offers?.getAllValid().then((offers) => {
        setOffers(offers);
      }); // offers for nft

      console.log(offers);
    };

    getOffers();
  }, [contract]);

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();

  // Listing data
  const { data: listing, isLoading } = useDirectListing(contract, listingId);

  // Buy Now NFT function
  const buyNft = async () => {
    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      return;
    }

    if (!listingId || !contract || !listing) return;

    // Toast notification to say buying NFT
    const notification = toast.loading("Buying process initialized...");

    const txResult = await contract.directListings
      .buyFromListing(listingId, 1, address)
      .then((tx) => {
        toast.success("NFT bought successfully", { id: notification });
        return tx;
      })
      .catch((error) => {
        toast.error("NFT couldn't be bought", { id: notification });
        console.log(error);
        return error;
      });

    console.log(txResult);
  };

  // Accept an offer function
  const acceptDirectOffer = async (offerId: string) => {
    // Toast notification to say accepting offer
    const notification = toast.loading("Accepting offer...");

    const txResult = await contract?.offers
      .acceptOffer(offerId)
      .then((tx) => {
        toast.success("Offer accepted", { id: notification });
        return tx;
      })
      .catch((error) => {
        toast.error("Offer couldn't be accepted", { id: notification });
        console.log(error);
        return error;
      });

    console.log(txResult);
  };

  //TODO: POPRAWIĆ TWORZENIE OFERT

  // Make an offer function
  const makeOffer = async () => {
    // Toast notification to making offer
    const notification = toast.loading("Making offer...");

    if (!contract || !listing || !bidAmount) return;

    console.log(bidAmount);

    console.log(listing);

    const txResult = await contract?.offers
      .makeOffer({
        assetContractAddress: listing.assetContractAddress, // Required - the contract address of the NFT to offer on
        tokenId: listing.id, // Required - the token ID to offer on
        totalPrice: bidAmount, // Required - the price to offer in the currency specified
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // Optional - defaults to the native wrapped currency
      })
      .then((tx) => {
        toast.success("Offer send", { id: notification });
        return tx;
      })
      .catch((error) => {
        toast.error("Offer couldn't be send", { id: notification });
        console.log(error);
        return error;
      });

    console.log(txResult);
  };

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
            <p>Sprzedaż bezpośrednia</p>

            <p className="font-bold">Cena "Kup teraz": </p>
            <p className="text-4xl font-bold">
              {listing.currencyValuePerToken.displayValue}{" "}
              {listing.currencyValuePerToken.symbol}
            </p>

            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold
               text-white rounded-full w-44 py-4 px-10"
            >
              Kup teraz
            </button>
          </div>
          {/* If direct, show offers here ... */}
          {offers && (
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-bold">Oferty: </p>
              <p className="font-bold">
                {offers.length > 0 ? offers.length : 0}
              </p>

              {offers.map((offer) => (
                <>
                  <p className="flex items-center ml-5 text-sm italic">
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offerorAddress.slice(0, 5) +
                      "..." +
                      offer.offerorAddress.slice(-5)}
                  </p>
                  <div>
                    <p
                      key={
                        offer.tokenId +
                        offer.offerorAddress +
                        offer.currencyValue.displayValue.toString()
                      }
                      className="text-sm italic"
                    >
                      {ethers.utils.formatEther(
                        offer.currencyValue.displayValue
                      )}{" "}
                      {NATIVE_TOKENS[ChainId.Mumbai].symbol}
                    </p>

                    {listing.creatorAddress === address && (
                      <button
                        onClick={() => acceptDirectOffer(offer.id)}
                        className="p-2 w-32 bg-red-500/50 rounded-lg 
                        font-bold text-sm cursor-pointer"
                      >
                        Zaakceptuj
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />

            <p className="col-span-2 font-bold">Zaoferuj niższa cenę [MATIC]</p>

            <input
              type="text"
              placeholder="Wpisz proponowaną kwotę"
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.value)}
              value={bidAmount}
            />
            <button
              onClick={makeOffer}
              className="bg-red-600 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Oferuj
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DirectListing;
