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
import { Button } from "@/components/ui/button";

import toast from "react-hot-toast";
import { useAddPropertyToNftModal } from "@/hooks/use-add-property-to-nft-modal";
import { Input } from "../ui/input";

const formSchema = z.object({
  trait_type: z.string().min(2, "Nazwa musi mieć minimum 2 znaki"),
  value: z.string().min(2, "Wartość musi mieć minimum 2 znaki"),
});

const AddPropertyToNftModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { data, onClose, isOpen } = useAddPropertyToNftModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trait_type: "",
      value: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { trait_type, value } = values;

    if (!trait_type || !value) return toast.error("Uzupełnij wszystkie pola!");

    onClose({
      trait_type,
      value,
    });
    form.reset();
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
      <DialogContent className="bg-white text-black dark:bg-gray-800 dark:text-white py-8 px-6 overflow-hidden">
        <DialogHeader className="">
          <DialogTitle className="text-2xl text-center font-bold">
            Dodaj atrybuty dla twojego NFT
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Pozwól swojemu NFT wyróżnić się na tle innych, dodając mu unikalne
            atrybuty.
          </DialogDescription>
          <hr color="white" />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 space-x-8">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="trait_type"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Nazwa atrybutu</FormLabel>
                      <FormControl>
                        <Input placeholder="Nazwa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Wartość atrybutu</FormLabel>
                      <FormControl>
                        <Input placeholder="Nazwa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <div className="w-full flex items-center justify-center ">
                <Button
                  type="submit"
                  variant="link"
                  className="text-xl font-bold hover:underline hover:decoration-pink-600/50 border-2 border-pink-600/50"
                  disabled={isLoading}
                >
                  Dodaj
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyToNftModal;
