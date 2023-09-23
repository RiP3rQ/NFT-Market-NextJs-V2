"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  MediaRenderer,
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { useModal } from "@/hooks/use-modal-store";
import toast from "react-hot-toast";
import { Mumbai } from "@thirdweb-dev/chains";

const formSchema = z.object({
  listingType: z.string().optional(),
  price: z.coerce.number().min(0.00001, "Cena musi być większa od 0.0001"),
});

const ListNftModal = () => {
  const [buyNowPrice, setBuyNowPrice] = useState(0);
  const [auctionPrice, setAuctionPrice] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();

  // Marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
    "marketplace-v3"
  );

  // Marketplace contract actions
  const { mutateAsync: createDirectListing } = useCreateDirectListing(contract);

  const { mutateAsync: createAuctionListing } =
    useCreateAuctionListing(contract);

  const { data, onClose, isOpen } = useModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingType: "directListing",
      price: 1,
    },
  });

  // Calculate prices for auction listing
  useEffect(() => {
    const nowPrice = form.getValues("price");
    const auctionPrice = form.getValues("price") * 0.3;
    setBuyNowPrice(nowPrice);
    setAuctionPrice(auctionPrice);
  }, [form.watch("price")]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let tekst = "Wystawianie NFT na sprzedaż...";
    if (values.listingType === "auctionListing") {
      tekst = "Wystawianie NFT na licytację...";
    }
    try {
      const notification = toast.loading(tekst);
      const { listingType, price } = values;

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
        toast.dismiss(notification);
        return;
      }

      if (listingType === "directListing") {
        createDirectListing(
          {
            assetContractAddress: data.assetContractAddress!,
            tokenId: data.id,
            currencyContractAddress:
              process.env.NEXT_PUBLIC_PAGE_CURRENCY_CONTRACT!,
            pricePerToken: price,
            quantity: 1,
            startTimestamp: new Date(),
            endTimestamp: new Date(
              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ),
          },
          {
            onSuccess() {
              toast.success("Wystawiono NFT na sprzedaż!", {
                id: notification,
              });
              router.push("/");
              form.reset();
              onClose();
            },
            onError() {
              toast.error("ERROR! Coś poszło nie tak", {
                id: notification,
              });
            },
          }
        );
      }

      if (listingType === "auctionListing") {
        createAuctionListing(
          {
            assetContractAddress: data.assetContractAddress!,
            tokenId: data.id,
            currencyContractAddress:
              process.env.NEXT_PUBLIC_PAGE_CURRENCY_CONTRACT!,
            quantity: 1,
            minimumBidAmount: price * 0.3,
            buyoutBidAmount: price,
            bidBufferBps: 500, // 5%
            startTimestamp: new Date(),
            endTimestamp: new Date(
              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ),
            timeBufferInSeconds: 60 * 60 * 24, // 1 day
          },
          {
            onSuccess() {
              toast.success("Wystawiono NFT na licytację!", {
                id: notification,
              });
              form.reset();
              router.push("/");
              onClose();
            },
            onError(error) {
              toast.error("ERROR! Coś poszło nie tak", {
                id: notification,
              });
              console.log(error);
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        form.reset();
      }}
    >
      <DialogContent className="bg-white text-black dark:bg-gray-800 dark:text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Wystaw NFT na rynek
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Sprawdź szczegóły swoje NFT, a następnie wybierz typ listingu oraz
            jego ceną i ciesz się zyskiem!
          </DialogDescription>
        </DialogHeader>
        <hr />
        <div className="flex flex-col items-center justify-center space-x-4 mt-2">
          <MediaRenderer
            key={data?.title}
            src={data?.image}
            className="h-48 rounded-lg"
            poster="https://res.cloudinary.com/dr3jjyqgi/image/upload/v1695510077/kpsszibzfuthyaqz6v9j.avif"
            requireInteraction={true}
          />
          <div className="w-[400px] inline-block text-center">
            <p className="text-lg font-bold">{data?.title}</p>
            <p className="text-xs ">{data?.description}</p>
          </div>
        </div>
        <hr />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="listingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Typ listingu:
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="directListing" id="r1" />
                            <Label htmlFor="r1">Bezpośredni Listing</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="auctionListing" id="r2" />
                            <Label htmlFor="r2">Licytacja</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-blue-600">
                      Cena: [RIPERS]
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="number"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="np. 0.001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.getValues("listingType") === "auctionListing" && (
                <div className="text-sm text-gray-400">
                  Cena licytacji:{" "}
                  <span className="font-bold text-green-500">
                    {auctionPrice} [RIPERS]
                  </span>{" "}
                  Cena kup teraz:{" "}
                  <span className="font-bold text-blue-600">
                    {buyNowPrice} [RIPERS]
                  </span>
                </div>
              )}
            </div>
            <DialogFooter className=" px-6 py-4">
              <Button
                variant="link"
                className="text-xl font-bold hover:underline hover:decoration-pink-600/50 border-2 border-pink-600/50"
                disabled={isLoading}
              >
                Wystaw
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ListNftModal;
