import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get("id");

  try {
    const collection = await db.collection.findFirst({
      where: {
        id: collectionId?.toString(),
      },
      include: { creator: true },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.log("[COLLECTION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
