"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useAddress,
  useContract,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";
import { Separator } from "@/components/ui/separator";
import { useAddPropertyToNftModal } from "@/hooks/use-add-property-to-nft-modal";
import ReorderCard from "./_components/reorder-card";

const formSchema = z.object({
  name: z.string().min(3, "Nazwa musi mieć minimum 3 znaki"),
  description: z.string().min(3, "Nazwa musi mieć minimum 3 znaki"),
});

const DodajNFT = () => {
  const address = useAddress();
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [attributes, setAttributes] = useState<Record<string, string>[]>([]);

  const { data, onClose, onOpen } = useAddPropertyToNftModal();

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // @ts-ignore
      setAttributes((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setAttributes]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Collection Contract for minting NFT
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
    "nft-collection"
  );
  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!contract || !address) {
      toast("Musisz być zalogowany, aby dodać NFT!", {
        duration: 4000,
        style: {
          background: "red",
          color: "white",
          fontWeight: "bold",
          fontSize: "17px",
          padding: "20px",
        },
      });
      return;
    }

    if (networkMismatch) {
      switchChain(Mumbai.chainId);
      toast("Błąd sieci. Zmień sieć i spróbuj ponownie!", {
        duration: 4000,
        style: {
          background: "orange",
          color: "white",
          fontWeight: "bold",
          fontSize: "17px",
          padding: "20px",
        },
      });
      return;
    }

    const notification = toast.loading("Tworzę nowe NFT!");

    try {
      await contract
        .mintTo(address, {
          name: values.name,
          description: values.description,
          image: file!,
          attributes: [
            {
              trait_type: "test_type",
              value: "test_value",
            },
          ],
        })
        .then((tx) => {
          console.log("tokenId:", tx.id); // the id of the NFT minted
          console.log("NFT:", tx.data()); // (optional) fetch details of minted NFT
          setTimeout(() => {
            router.push(`/dodaj/${tx.id}`);
          }, 2000);
        })
        .then(() => {
          toast.success("Huraa! NFT utworzone pomyślnie!", {
            id: notification,
          });
        });
    } catch (error) {
      toast.error("Coś poszło nie tak!", {
        id: notification,
      });
    }
  };

  return (
    <div className="flex justify-center h-fit mt-4">
      <main className="max-w-7xl mx-auto p-10 border ">
        <h1 className="text-2xl font-bold text-center">Stwórz własne NFT</h1>
        <h2 className="text-lg font-semibold pt-5">Szczegóły tworzonego NFT</h2>
        <p className="pb-5 text-sm">
          Tworząc NFT, tworzysz unikalny token, który jest niepowtarzalny i
          niezależny od innych tokenów, którzy następnie możesz sprzedać lub
          podarować na naszej platformie lub na innej platformie NFT.
        </p>

        <hr className="text-white mb-2" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nazwa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input placeholder="Opis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-12">
              <div className="col-span-3">
                <div className="w-full items-center gap-1.5 mb-2 space-y-2">
                  <Label htmlFor="picture">Plik</Label>
                  <Input id="picture" type="file" className="cursor-pointer" />
                </div>
                <div className="w-full flex items-center justify-center">
                  <Button
                    variant="link"
                    className="text-xl font-bold hover:underline hover:decoration-pink-600/50 border-2 border-pink-600/50"
                    disabled={isLoading}
                  >
                    Wystaw
                  </Button>
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                <Separator orientation="vertical" />
              </div>
              <div className="col-span-8">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-bold">
                    Dodaj unikalne atrybuty:
                  </Label>
                  <Button
                    type="button"
                    onClick={() => onOpen()}
                    className="h-8"
                  >
                    Dodaj atrybut
                  </Button>
                </div>
                <Separator className="mt-1 mb-2" />

                {attributes.length > 0
                  ? attributes.map((attribute, index) => (
                      <ReorderCard
                        key={index}
                        attributeName={attribute.propertyName}
                        attributeValue={attribute.propertyValue}
                      />
                    ))
                  : null}
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default DodajNFT;
