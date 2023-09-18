import { NextResponse } from "next/server";
import { Collection } from "@prisma/client";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const collection = await db.collection.create({
      data: {
        title: "RiP3rQ's Crypto Apes Collection",
        description: "Newest NFT Collection from RiP3rQ",
        nftCollectionName: "Crypto Apes",
        address: "0x0CeDb6A3f01cd76DbEACe475Def1Ade6aa06ad7d",
        creatorId: "clmp0cuxh0000vb80ba9tqdlo",
        mainImage:
          "https://15065ae3c21e0bff07eaf80b713a6ef0.ipfscdn.io/ipfs/bafybeiaciddzq4g3ino43nyr3jobwk3m5ycby3f42k2aqo2c2ej5u5elm4/main.jfif",
        previewImage:
          "https://15065ae3c21e0bff07eaf80b713a6ef0.ipfscdn.io/ipfs/bafybeibg2psahmef3nqrpnoa6zli4svj3xyfcpabb2gmkwosovp3akfvoa/1.jfif",
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
