import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";

type Props = {
  trait_type: string;
  value: string;
};

const AttributeBlock = ({ trait_type, value }: Props) => {
  return (
    <div
      id={trait_type}
      key={trait_type}
      className="flex flex-col items-center justify-center border bg-slate-700 rounded-lg h-20 w-full"
    >
      <p className="text-base text-white font-bold uppercase">{trait_type}</p>
      {/* <Separator /> */}
      <p className="text-gray-200 text-sm">{value}</p>
    </div>
  );
};

export default AttributeBlock;
