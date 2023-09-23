import { useBalance } from "@thirdweb-dev/react";

export function useCurrencyBalance() {
  // Website currency balance
  const currencyBalance = useBalance(
    process.env.NEXT_PUBLIC_PAGE_CURRENCY_CONTRACT!
  );

  return currencyBalance;
}
