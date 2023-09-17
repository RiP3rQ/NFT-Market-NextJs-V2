"use client";

import React, { useEffect, useState } from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export const WEB3Provider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId="d7ce6f0253a235248c2644ce19111501"
    >
      {children}
    </ThirdwebProvider>
  );
};
