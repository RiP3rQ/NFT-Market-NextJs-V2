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
import { Button } from "@/components/ui/button";

import toast from "react-hot-toast";
import { useSortModal } from "@/hooks/use-sort-modal";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  sortCategory: z.string(),
  sortDirection: z.string(),
});

const SortModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { data, onClose, isOpen } = useSortModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sortCategory: "Wszystkie",
      sortDirection: "asc",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { sortCategory, sortDirection } = values;

    if (!sortCategory || !sortDirection)
      return toast.error("Uzupełnij wszystkie pola!");

    onClose({
      sortCategory: sortCategory,
      sortDirection: sortDirection,
    });
    console.log(values);
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
            Sortuj wyniki wyszukiwania
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Posortuj oferty znajdujące się na rynku według wybranych kryteriów.
          </DialogDescription>
        </DialogHeader>
        <hr color="white" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="sortCategory"
                  render={() => (
                    <FormItem>
                      <FormLabel className="uppercase text-lg font-bold text-zinc-500 dark:text-white">
                        Sortuj według typu listingu:
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-x-2 cursor-pointer">
                          <Button
                            type="button"
                            onClick={() =>
                              form.setValue("sortCategory", "directListing")
                            }
                            className={cn(
                              "flex items-center justify-center space-x-2 py-3 px-5 bg-slate-400",
                              form.watch("sortCategory") == "directListing" &&
                                "bg-blue-600 border-2 border-pink-600/50 text-white"
                            )}
                          >
                            Bezpośredni
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              form.setValue("sortCategory", "auctionListing")
                            }
                            className={cn(
                              "flex items-center justify-center space-x-2 py-3 px-5 bg-slate-400",
                              form.watch("sortCategory") == "auctionListing" &&
                                "bg-blue-600 border-2 border-pink-600/50 text-white"
                            )}
                          >
                            Licytacja
                          </Button>
                          <Button
                            type="button"
                            onClick={() => form.setValue("sortCategory", "all")}
                            className={cn(
                              "flex items-center justify-center space-x-2 py-3 px-5 bg-slate-400",
                              form.watch("sortCategory") == "all" &&
                                "bg-blue-600 border-2 border-pink-600/50 text-white"
                            )}
                          >
                            Wszystkie
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sortDirection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-blue-600">
                      Sortuj według ceny:
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-x-2"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <RadioGroupItem value="asc" id="r1" />
                          <Label htmlFor="r1">Rosnąco</Label>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <RadioGroupItem value="desc" id="r2" />
                          <Label htmlFor="r2">Malejąco</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className=" px-6 py-4">
              <Button
                type="submit"
                variant="link"
                className="text-xl font-bold hover:underline hover:decoration-pink-600/50 border-2 border-pink-600/50"
                disabled={isLoading}
              >
                Sortuj
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SortModal;
