"use client";

import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { Separator } from "@/components/ui/separator";
import NftCard from "@/components/ekwipunek/nft-card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useActiveListings } from "@/hooks/use-active-listings";

const EkwipunekPage = () => {
  const router = useRouter();
  const address = useAddress();

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!address) {
  //       router.push("/");
  //       toast.error("Musisz być zalogowany, aby zobaczyć tę stronę");
  //     }
  //   }, 1000);
  // }, [address]);

  //Get active direct listings and auctions from marketplace
  const { directListings, auctionListings } = useActiveListings();

  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const { contract: dropContract } = useContract(
    process.env.NEXT_PUBLIC_NFT_DROP_ADDRESS,
    "nft-drop"
  );
  const { contract: dropContractPunks } = useContract(
    process.env.NEXT_PUBLIC_NFT_DROP_PUNKS_ADDRESS,
    "nft-drop"
  );
  const ownedNfts = useOwnedNFTs(collectionContract, address);
  const ownedNftsFromDrop = useOwnedNFTs(dropContract, address);
  const ownedNftsFromDropPunks = useOwnedNFTs(dropContractPunks, address);

  // If not logged in
  if (!address) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <main className="max-w-7xl mx-auto p-10 border ">
          <h1 className="text-8xl font-bold text-center animate-pulse text-red-500">
            ZALOGUJ SIĘ ABY ZOBACZYĆ EKWIPUNEK
          </h1>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <main className="p-10 pt-2">
        <h1 className="text-4xl font-bold">Lista posiadanych NFT</h1>
        <h2 className="text-xl font-semibold pt-5">
          Jeżeli chcesz wystawić NFT na sprzedaż, wybierz go z listy poniżej
        </h2>
        <Separator className="mb-2" />

        <div className="p-4 w-full grid grid-cols-2 2xl:grid-cols-4 gap-4 ">
          {ownedNfts?.data?.map((ntf) => (
            <NftCard
              key={ntf.metadata.id}
              id={ntf.metadata.id}
              title={ntf.metadata.name?.toString()}
              description={ntf.metadata.description?.toString()}
              image={ntf.metadata.image?.toString()}
              assetContractAddress={
                process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!
              }
            />
          ))}
          {ownedNftsFromDrop?.data?.map((ntf) => (
            <NftCard
              key={ntf.metadata.id}
              id={ntf.metadata.id}
              title={ntf.metadata.name?.toString()}
              description={ntf.metadata.description?.toString()}
              image={ntf.metadata.image?.toString()}
              assetContractAddress={process.env.NEXT_PUBLIC_NFT_DROP_ADDRESS!}
            />
          ))}
          {ownedNftsFromDropPunks?.data?.map((ntf) => (
            <NftCard
              key={ntf.metadata.id}
              id={ntf.metadata.id}
              title={ntf.metadata.name?.toString()}
              description={ntf.metadata.description?.toString()}
              image={ntf.metadata.image?.toString()}
              assetContractAddress={
                process.env.NEXT_PUBLIC_NFT_DROP_PUNKS_ADDRESS!
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default EkwipunekPage;
