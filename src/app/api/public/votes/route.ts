import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = await getPrisma();
  const count = await prisma.vote.count();
  const results = await prisma.vote.findMany({
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      commentId: true,
      value: true,
      userId: true,
    },
  });

  return NextResponse.json({
    count: count,
    results,
  });
}
