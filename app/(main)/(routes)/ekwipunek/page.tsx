"use client";

import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { Separator } from "@/components/ui/separator";
import NftCard from "@/components/ekwipunek/nft-card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const EkwipunekPage = () => {
  const router = useRouter();
  const address = useAddress();

  if (!address) {
    router.push("/oferty");
    toast.error("Musisz być zalogowany, aby zobaczyć tę stronę");
  }
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
            />
          ))}
          {ownedNftsFromDrop?.data?.map((ntf) => (
            <NftCard
              key={ntf.metadata.id}
              id={ntf.metadata.id}
              title={ntf.metadata.name?.toString()}
              description={ntf.metadata.description?.toString()}
              image={ntf.metadata.image?.toString()}
            />
          ))}
          {ownedNftsFromDropPunks?.data?.map((ntf) => (
            <NftCard
              key={ntf.metadata.id}
              id={ntf.metadata.id}
              title={ntf.metadata.name?.toString()}
              description={ntf.metadata.description?.toString()}
              image={ntf.metadata.image?.toString()}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default EkwipunekPage;
