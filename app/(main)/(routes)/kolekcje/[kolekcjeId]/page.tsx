"use client";

import React, { useEffect, useState } from "react";
import {
  useAddress,
  useContract,
  useSwitchChain,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";
import { BigNumber } from "ethers";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Collection } from "@prisma/client";
import qs from "query-string";

const NFTDropInvidualPage = () => {
  const [collectionLoading, setCollectionLoading] = useState<boolean>(true);
  const [collection, setCollection] = useState<Collection>();
  const collectionId = usePathname().split("/")[2];
  const searchParams = useSearchParams();
  const collectionAddress = searchParams?.get("collectionAddress");

  // fetch collection data
  useEffect(() => {
    setCollectionLoading(true);

    const getSingleCollection = async () => {
      const collectionData = await axios.get(
        "/api/kolekcje/pojedynczaKolekcja",
        {
          params: {
            id: collectionId,
          },
        }
      );
      setCollection(collectionData.data);
      setCollectionLoading(false);
    };

    getSingleCollection();
  }, []);

  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [loading, setLoading] = useState<boolean>(true);
  const [priceInMatic, setPriceInMatic] = useState<string>("");
  const { contract: nftDrop } = useContract(collectionAddress, "nft-drop");
  const router = useRouter();

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();
  // ---

  // Auth
  const address = useAddress();
  // ---

  // fetch price for minting
  useEffect(() => {
    if (!nftDrop) return;

    const fetchPrice = async () => {
      const claimCondition = await nftDrop.claimConditions.getAll();

      setPriceInMatic(claimCondition?.[0].currencyMetadata.displayValue);
    };

    fetchPrice();
  }, [nftDrop]);
  // ---

  // fetching supply of the NFT Drop
  useEffect(() => {
    if (!nftDrop) return;

    const fetchNFTDropData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total);

      setLoading(false);
    };

    fetchNFTDropData();
  }, [nftDrop]);
  // ---

  const mintNft = () => {
    if (!nftDrop || !address) return;

    // toaster notification
    const notification = toast.loading("Minting...", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      },
    });

    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      toast("Network mismatch. Try again Now", {
        duration: 8000,
        style: {
          background: "orange",
          color: "white",
          fontWeight: "bold",
          fontSize: "17px",
          padding: "20px",
        },
      });
      toast.dismiss(notification);
      return;
    }

    const quantity = 1; // how many unique NFT to mint

    setLoading(true);

    nftDrop
      ?.claimTo(address, quantity)
      .then(async (tx: { data: () => any }[]) => {
        const claimedNFT = await tx[0].data(); // (optional) get the claimed NFT metadata from the

        toast("HOORAY... Your minting was successful", {
          duration: 8000,
          style: {
            background: "green",
            color: "white",
            fontWeight: "bold",
            fontSize: "17px",
            padding: "20px",
          },
        });

        setTimeout(() => {
          const url = qs.stringifyUrl(
            {
              url: `/minted/${claimedNFT.metadata.id}`,
              query: {
                name: claimedNFT.metadata.name,
                image: claimedNFT.metadata.image,
                description: claimedNFT.metadata.description,
                owner: claimedNFT.owner,
                supply: claimedNFT.supply,
              },
            },
            { skipNull: true }
          );

          router.push(url);
        }, 3000);
      })
      .catch(() =>
        toast("WHOOOPS something didn't go as planed", {
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        })
      )
      .finally(() => {
        setLoading(false);
        toast.dismiss(notification);
      });
  };

  if (collectionLoading)
    return (
      <div className="bg-slate-100 h-full flex flex-col items-center justify-center">
        <InfinitySpin width="200" color="#4fa94d" />
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );

  return (
    <div className="flex h-full flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:h-full">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={collection?.previewImage}
              alt={collection?.title}
            />
          </div>
          <div className="text-center p-5 space-y-6">
            <h1 className="text-4xl font-bold text-white">
              {collection?.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection?.description}</h2>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Content of Right Side */}
        <div
          className="mt-10 flex flex-1 flex-col items-center 
      space-y-6 text-center lg:space-y-0 lg:justify-center"
        >
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={collection?.mainImage}
            alt={collection?.title}
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection?.title}
          </h1>

          {loading ? (
            <p className="pt-2 text-xl text-green-500 animate-pulse">
              Loading supply count ...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply}/{totalSupply?.toString()} NFT's claimed
            </p>
          )}

          {loading && <InfinitySpin width="200" color="#4fa94d" />}
        </div>

        {/* Mint Button */}
        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="mt-10 h-16 bg-red-600/80 w-full text-white 
      rounded-full font-bold disabled:bg-gray-400"
        >
          {loading ? (
            <>loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>CONNECT WALLET</>
          ) : (
            <div>Mint NFT ({priceInMatic}MATIC)</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default NFTDropInvidualPage;
