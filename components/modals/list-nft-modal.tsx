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
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";

const formSchema = z.object({
  listingType: z.string().optional(),
  price: z.number().min(0.000001).default(0.001),
});

const ListNftModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();

  // Marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  // Marketplace contract actions
  const {
    mutate: createDirectListing,
    isLoading: isLoadingDirect,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(contract);

  const { data, onClose, isOpen } = useModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingType: "directListing",
      price: 0.001,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const notification = toast.loading("Wystawianie NFT na sprzedaż...");
      const { listingType, price } = values;

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

      if (listingType === "directListing") {
        createDirectListing(
          {
            assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
            tokenId: data?.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
            quantity: 1,
            buyoutPricePerToken: price,
            startTimestamp: new Date(),
          },
          {
            onSuccess() {
              toast.success("Listing made successfully!", {
                id: notification,
              });
            },
            onError() {
              toast.error("Listing couldn't be made! ERROR!", {
                id: notification,
              });
            },
          }
        );
      }

      if (listingType === "auctionListing") {
        createAuctionListing(
          {
            assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
            tokenId: data?.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
            quantity: 1,
            buyoutPricePerToken: price,
            startTimestamp: new Date(),
            reservePricePerToken: 0,
          },
          {
            onSuccess() {
              toast.success("Listing made successfully!", {
                id: notification,
              });
              router.push("/");
            },
            onError() {
              toast.error("Listing couldn't be made! ERROR!", {
                id: notification,
              });
            },
          }
        );
      }

      form.reset();
      //   router.refresh();
      //   window.location.reload();
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
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Wystaw NFT na sprzedaż
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Sprawdź szczegóły swoje NFT, a następnie wybierz typ listingu oraz
            jego ceną i ciesz się zyskiem!
          </DialogDescription>
        </DialogHeader>
        <hr />
        <div className="flex flex-col items-center justify-center space-x-4 mt-2">
          <MediaRenderer src={data?.image} className="h-48 rounded-lg" />
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
                        <RadioGroup defaultValue="directListing">
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
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Cena:
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="np. 0.001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                variant="link"
                className="text-xl font-bold hover:underline hover:decoration-pink-600/50"
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