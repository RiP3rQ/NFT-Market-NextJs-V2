"use client";

import { useModal } from "@/hooks/use-modal-store";
import { MediaRenderer } from "@thirdweb-dev/react";

interface NftCardProps {
  title?: string;
  description?: string;
  image?: string;
  id: string;
  assetContractAddress: string;
}

const NftCard = ({
  title,
  description,
  image,
  id,
  assetContractAddress,
}: NftCardProps) => {
  const { onOpen } = useModal();

  return (
    <div
      key={id}
      id={id}
      className="flex flex-col items-center justify-center space-y-2 border-2 dark:bg-gray-800 p-4 ww-80 h-96 cursor-pointer rounded-lg hover:bg-slate-500 hover:opacity-70 "
      onClick={() =>
        onOpen({ image, title, description, id, assetContractAddress })
      }
    >
      <MediaRenderer
        key={title}
        src={image}
        className="h-48 rounded-lg"
        poster="https://res.cloudinary.com/dr3jjyqgi/image/upload/v1695510077/kpsszibzfuthyaqz6v9j.avif"
        requireInteraction={true}
      />
      <div className="w-[300px] inline-block text-center">
        <p className="text-lg truncate font-bold">{title}</p>
        <p className="text-xs mx-2 truncate">{description}</p>
      </div>
    </div>
  );
};

export default NftCard;
