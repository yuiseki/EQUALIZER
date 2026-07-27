import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = await getPrisma();
  const count = await prisma.conversation.count();
  const results = await prisma.conversation.findMany({
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      topic: true,
      description: true,
    },
  });

  return NextResponse.json({
    count: count,
    results: results,
  });
}
