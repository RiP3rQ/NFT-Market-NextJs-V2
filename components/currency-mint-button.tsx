"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  useAddress,
  useContract,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";
import toast from "react-hot-toast";
import { useCurrencyBalance } from "@/hooks/use-get-currency-ballance";

export const CurrencyMintButton = () => {
  // Wallet address
  const address = useAddress();

  // Website currency balance
  const currencyBalance = useCurrencyBalance();

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const switchChain = useSwitchChain();

  // Token contract
  const { contract: token, isLoading } = useContract(
    process.env.NEXT_PUBLIC_PAGE_CURRENCY_CONTRACT!,
    "token-drop"
  );

  // Mint token function
  const mintToken = async () => {
    try {
      if (!token && !address) return;

      if (networkMismatch) {
        switchChain(Mumbai.chainId);
        return;
      }

      const notification = toast.loading("Zdobywanie waluty [RIPERS]...");

      await token?.erc20
        .claim(100)
        .then(() => {
          toast.success("Uzyskano 100x[RIPERS]!", { id: notification });
          window.location.reload();
        })
        .catch((error) => {
          toast.error("Token nie mógł zostać wygenerowany.", {
            id: notification,
          });
          console.log(error);
          return error;
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (!address) return null;

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-full w-40 border border-slate-400 bg-slate-700 rounded-lg p-[10px]">
        Ładowanie ...
      </div>
    );

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-40 border border-slate-400 bg-slate-700 rounded-lg p-[10px]"
      data-test="currency-add-button"
    >
      {/* Wallet balance */}
      <p className="text-xs text-white">
        Saldo: {currencyBalance?.data?.displayValue} [RIPERS]
      </p>
      {/* MINT BUTTON */}
      <Button className="text-xs h-5 p-2 bg-green-500" onClick={mintToken}>
        Dodaj walutę
      </Button>
    </div>
  );
};
