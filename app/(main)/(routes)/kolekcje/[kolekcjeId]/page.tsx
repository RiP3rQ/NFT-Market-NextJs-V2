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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  collection: {
    _id: string;
    title: string;
    description: string;
    nftCollectionName: string;
    address: string;
    slug: {
      current: string;
    };
    creator: string;
    mainImage: string;
    previewImage: string;
  };
};

const NFTDropInvidualPage = ({ collection }: Props) => {
  const { toast } = useToast();

  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const { contract: nftDrop } = useContract(
    process.env.NEXT_PUBLIC_NFT_DROP_ADDRESS,
    "nft-drop"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [priceInMatic, setPriceInMatic] = useState<string>("");
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
    toast({
      title: "Minting NFT",
      description: "Please wait while we mint your NFT",
      variant: "default",
      duration: 8000,
    });

    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      toast({
        title: "Network mismatch",
        description: "Switching to Mumbai Network. Try again Now!",
        variant: "default",
        duration: 8000,
        className: "bg-orange-500 text-white font-bold text-lg px-6 py-4",
      });
      return;
    }

    const quantity = 1; // how many unique NFT to mint

    setLoading(true);

    nftDrop
      ?.claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt; // the transaction receipt
        const claimedTokenId = tx[0].id; // the id of the NFT claimed
        const claimedNFT = await tx[0].data(); // (optional) get the claimed NFT metadata from the

        toast({
          title: "Transaction Successful",
          description: "Your NFT was minted successfully",
          duration: 3000,
          className: "bg-green-500 text-white font-bold text-lg px-6 py-4",
        });

        // setTimeout(() => {
        //   router.push({
        //     pathname: `/minted/${claimedNFT.metadata.id}`,
        //     query: {
        //       name: claimedNFT.metadata.name,
        //       image: claimedNFT.metadata.image,
        //       description: claimedNFT.metadata.description,
        //       owner: claimedNFT.owner,
        //       supply: claimedNFT.supply,
        //     },
        //   });
        // }, 3000);
      })
      .catch((err) =>
        toast({
          title: "Transaction Failed",
          description: err.message,
          variant: "default",
          duration: 3000,
          className: "bg-red-500 text-white font-bold text-lg px-6 py-4",
        })
      )

      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="apes collection"
            />
          </div>
          <div className="text-center p-5 space-y-6">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
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
            src="https://links.papareact.com/8sg"
            alt="apes collection"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
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
