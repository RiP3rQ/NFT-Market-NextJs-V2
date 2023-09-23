"use client";

import { useEffect, useState } from "react";
import ListNftModal from "@/components/modals/list-nft-modal";
import SortModal from "@/components/modals/sort-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ListNftModal />
      <SortModal />
    </>
  );
};
