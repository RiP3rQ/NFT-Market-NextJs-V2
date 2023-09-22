"use client";

import { Button } from "@/components/ui/button";
import { useAddress, useMetamask, ConnectWallet } from "@thirdweb-dev/react";

const ConnectWalletButton = () => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();

  return (
    <div>
      {address ? (
        <ConnectWallet />
      ) : (
        <Button
          onClick={() => connectWithMetamask()}
          className="rounded-full bg-rose-500 px-4 py-2
           text-white text-sm font-bold lg:px-5 lg:py-3 lg:text-base"
        >
          Połącz Portfel
        </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
