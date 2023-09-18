import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const collections = await db.collection.findMany({
      orderBy: { createdAt: "desc" },
      include: { creator: true },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.log("[COLLECTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
