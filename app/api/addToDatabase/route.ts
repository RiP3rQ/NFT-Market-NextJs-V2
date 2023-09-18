import { NextResponse } from "next/server";
import { Collection } from "@prisma/client";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const collection = await db.collection.create({
      data: {
        title: "RiP3rQ Cryptopunks Collection",
        description: "Awesome futuristic Cryptopunks Collection",
        nftCollectionName: "Cryptopunks",
        address: "0xC3aA0F9330D57B4cd47ab08a470e64F8be5496A2",
        creatorId: "clmp0cuxh0000vb80ba9tqdlo",
        mainImage:
          "https://15065ae3c21e0bff07eaf80b713a6ef0.ipfscdn.io/ipfs/bafybeigwkjjadxhrkguu3fgpekky2mtrl7awceuwqewmmwj4rdzvc7gony/main.jfif",
        previewImage:
          "https://15065ae3c21e0bff07eaf80b713a6ef0.ipfscdn.io/ipfs/bafybeie5vltxb2weaxt53atj3ddbfagcp3t4dnus3rmm5kkakqsnq67ela/0.png",
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
