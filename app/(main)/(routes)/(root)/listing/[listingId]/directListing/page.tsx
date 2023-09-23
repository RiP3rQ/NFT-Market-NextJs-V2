"use client";

import {
  MediaRenderer,
  useAddress,
  useContract,
  useDirectListing,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Mumbai } from "@thirdweb-dev/chains";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import AttributeBlock from "@/components/root/attribute-block";

const DirectListing = ({ params }: { params: { listingId: string } }) => {
  const [isSomethingOnPageLoading, setIsSomethingOnPageLoading] =
    useState(false);
  const address = useAddress();
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState(0.1);
  const [offers, setOffers] = useState<any[]>([]);
  const { listingId } = params;

  // Marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
    "marketplace-v3"
  );

  // Listing data
  const { data: listing, isLoading } = useDirectListing(contract, listingId);

  // Marketplace contract actions [get offers for specific nft]
  useEffect(() => {
    if (!contract || !listing) return;

    const getOffers = async () => {
      await contract?.offers
        ?.getAllValid({
          tokenId: listing!.tokenId,
        })
        .then((offers) => {
          // sorting offers by price
          offers.sort((a, b) => {
            const displayValueA = parseFloat(a.currencyValue.displayValue);
            const displayValueB = parseFloat(b.currencyValue.displayValue);

            // Compare in descending order
            if (displayValueA < displayValueB) {
              return 1;
            } else if (displayValueA > displayValueB) {
              return -1;
            } else {
              return 0;
            }
          });
          setOffers(offers);
        })
        .catch((error) => {
          console.log(error);
          return;
        }); // offers for nft
    };

    getOffers();
  }, [contract, listing]);

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();

  // Buy Now NFT function
  const buyNft = async () => {
    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      return;
    }

    if (!listingId || !contract || !listing) return;

    // Disable all buttons on page
    setIsSomethingOnPageLoading(true);

    // Toast notification to say buying NFT
    const notification = toast.loading("Rozpocząto proces kupna...");

    await contract.directListings
      .buyFromListing(listingId, 1, address)
      .then((tx) => {
        toast.success("Zakupiono pomyślnie!", { id: notification });
        setTimeout(() => {
          router.push(`/ekwipunek`);
        }, 1000);
        return tx;
      })
      .catch((error) => {
        toast.error("UPS! Coś poszło nie tak.", { id: notification });
        console.log(error);
        return error;
      })
      .finally(() => {
        setBidAmount(0.1);
        setIsSomethingOnPageLoading(false);
      });
  };

  // Accept an offer function
  const acceptDirectOffer = async (offerId: string) => {
    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      return;
    }

    // Disable all buttons on page
    setIsSomethingOnPageLoading(true);

    // Toast notification to say accepting offer
    const notification = toast.loading("Akceptowanie oferty..");

    await contract?.offers
      .acceptOffer(offerId)
      .then((tx) => {
        toast.success("Oferta zaakceptowana!", { id: notification });
        setTimeout(() => {
          router.push(`/`);
        }, 2000);
      })
      .catch((error) => {
        toast.error("Oferta nie mogła zostać zaakceptowana.", {
          id: notification,
        });
        console.log(error);
      })
      .finally(() => {
        setIsSomethingOnPageLoading(false);
      });
  };

  // Make an offer function
  const makeOffer = async () => {
    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      return;
    }

    // Disable all buttons on page
    setIsSomethingOnPageLoading(true);

    // Toast notification to making offer
    const notification = toast.loading("Tworzę ofertę...");

    if (!contract || !listing || !bidAmount) return;

    if (bidAmount >= parseFloat(listing.currencyValuePerToken.displayValue)) {
      // Toast notification to say buying NFT
      toast.success(`Przebiłeś cenę "Kup Teraz"! Zamiast tego kupuję`, {
        id: notification,
      });
      buyNft();
      return;
    }

    await contract?.offers
      .makeOffer({
        assetContractAddress: listing.assetContractAddress, // Required - the contract address of the NFT to offer on
        tokenId: listing.tokenId, // Required - the token ID to offer on
        totalPrice: bidAmount, // Required - the price to offer in the currency specified
        currencyContractAddress:
          process.env.NEXT_PUBLIC_PAGE_CURRENCY_CONTRACT!, // Required - the contract address of the currency to offer in
        endTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10), // Optional - Defaults to 10 years from now
        quantity: 1, // Optional - defaults to 1
      })
      .then(() => {
        toast.success("Oferta wysłana!", { id: notification });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        toast.error("Oferta nie mogła zostać wysłana.", { id: notification });
        console.log(error);
      })
      .finally(() => {
        setBidAmount(0.1);
        setIsSomethingOnPageLoading(false);
      });
  };

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
            <p>Sprzedaż bezpośrednia</p>

            <p className="font-bold">Cena "Kup teraz": </p>
            <p className="text-4xl font-bold">
              {listing.currencyValuePerToken.displayValue}{" "}
              {listing.currencyValuePerToken.symbol}
            </p>

            <Button
              disabled={isSomethingOnPageLoading}
              onClick={buyNft}
              className="col-start-2 mt-2 bg-blue-600 font-bold
               text-white rounded-full w-44 py-4 px-10"
            >
              Kup teraz
            </Button>
          </div>
          {/* If direct, show offers here ... */}
          {offers && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-y-2">
                <p className="font-bold">Liczba ofert: </p>
                <p className="font-bold flex items-center justify-center">
                  {offers.length > 0 ? offers.length : 0}
                </p>
              </div>
              <Separator />
              {offers.map((offer) => (
                <div className="grid grid-cols-2 gap-y-2" key={offer.id}>
                  <p className="flex items-center ml-5 text-sm italic">
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offerorAddress === address ? (
                      <span className="font-bold text-green-500">
                        Twój address
                      </span>
                    ) : (
                      <span className="font-bold">
                        {offer.offerorAddress.slice(0, 5) +
                          "..." +
                          offer.offerorAddress.slice(-5)}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <p
                      key={
                        offer.tokenId +
                        offer.offerorAddress +
                        offer.currencyValue.displayValue.toString()
                      }
                      className="text-sm italic"
                    >
                      {offer.currencyValue.displayValue}{" "}
                      {offer.currencyValue.symbol}
                    </p>

                    {listing.creatorAddress === address && (
                      <Button
                        disabled={isSomethingOnPageLoading}
                        onClick={() => acceptDirectOffer(offer.id)}
                        className="p-2 w-32 bg-green-500 rounded-lg 
                        font-bold text-sm cursor-pointer"
                      >
                        Zaakceptuj
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          <Separator />

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <p className="col-span-2 font-bold">
              Zaoferuj niższa cenę [RIPERS]:
            </p>

            <input
              type="number"
              placeholder="Wpisz proponowaną kwotę"
              className="border p-2 rounded-lg mr-5"
              onChange={(e) => setBidAmount(e.target.valueAsNumber)}
              value={bidAmount}
            />
            <div className="flex items-center justify-center">
              <Button
                disabled={isSomethingOnPageLoading}
                onClick={() => makeOffer()}
                className="bg-green-600 font-bold text-white rounded-full w-44 py-4 px-10 "
              >
                Oferuj
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DirectListing;
