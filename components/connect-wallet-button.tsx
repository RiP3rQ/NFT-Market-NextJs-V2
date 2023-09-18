"use client";

import { Button } from "@/components/ui/button";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

const ConnectWalletButton = () => {
  const connectWithMetamask = useMetamask();
  const disconnectWithMetamask = useDisconnect();
  const address = useAddress();

  return (
    <div>
      {address ? (
        <Button
          onClick={disconnectWithMetamask}
          className="rounded-full bg-rose-500 px-4 py-2
         text-white text-sm font-bold lg:px-5 lg:py-3 lg:text-base"
        >
          Witamy, {address.slice(0, 4)}...{address.slice(-4)}
        </Button>
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
