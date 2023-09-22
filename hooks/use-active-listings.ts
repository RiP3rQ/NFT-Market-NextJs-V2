import {
  useContract,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";

export function useActiveListings() {
  // Marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
    "marketplace-v3"
  );

  const { data: directListings } = useValidDirectListings(contract);

  const { data: auctionListings } = useValidEnglishAuctions(contract);

  if (!directListings) {
    if (!auctionListings) return { directListings: [], auctionListings: [] };
    return { directListings: [], auctionListings };
  }

  if (!auctionListings) {
    if (!directListings) return { directListings: [], auctionListings: [] };
    return { directListings, auctionListings: [] };
  }

  return {
    directListings,
    auctionListings,
  };
}
