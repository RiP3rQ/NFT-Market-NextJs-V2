"use client";

import { Button } from "@/components/ui/button";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

const DodajNFT = () => {
  const address = useAddress();
  const router = useRouter();
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) return;

    const notification = toast.loading("Tworzę nowy projekt NFT!");

    if (!image) {
      toast.error("Wybierz zdjęcie!", {
        id: notification,
      });
      return;
    }

    // own type for form handling
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };

    try {
      const tx = await contract.mintTo(address, metadata);
      const receipt = tx.receipt; // the transaction receipt
      const tokenId = tx.id; // the id of the NFT minted
      const nft = await tx.data(); // (optional) fetch details of minted NFT

      toast.success("Huraa! NFT utworzone pomyślnie!", {
        id: notification,
      });
      setTimeout(() => {
        router.push("/ekwipunek");
      }, 2000);
    } catch (error) {
      toast.error("Coś poszło nie tak!", {
        id: notification,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <main className="max-w-6xl mx-auto p-10 border ">
        <h1 className="text-4xl font-bold text-center">Stwórz własne NFT</h1>
        <h2 className="text-xl font-semibold pt-5">Szczegóły tworzonego NFT</h2>
        <p className="pb-5">
          Tworząc NFT, tworzysz unikalny token, który jest niepowtarzalny i
          niezależny od innych tokenów, którzy następnie możesz sprzedać lub
          podarować na naszej platformie lub na innej platformie NFT.
        </p>

        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-10">
          <img
            className="border h-80 w-80 object-contain"
            src={preview || "https://links.papareact.com/ucj"}
            alt=""
          />

          <form
            onSubmit={mintNft}
            className="flex flex-col h-80 flex-1 p-2 space-y-4"
          >
            <label className="font-light">Nazwa:</label>
            <input
              className="formField"
              type="text"
              placeholder="Nazwa tworzonego NFT..."
              name="name"
              id="name"
            />

            <label className="font-light">Opis:</label>
            <input
              className="formField"
              type="text"
              placeholder="Opisz swoje dzieło..."
              name="description"
              id="description"
            />

            <label className="font-light">Zdjęcie:</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />
            <Button
              type="submit"
              className="bg-blue-600 font-bold text-white rounded-full py-4 px-10 w-56 mt-auto mx-auto md:ml-auto"
            >
              Stwórz NFT
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DodajNFT;
