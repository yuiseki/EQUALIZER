import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const count = await prisma.comment.count();
  const results = await prisma.comment.findMany({
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      conversationId: true,
      text: true,
    },
  });

  return NextResponse.json(
    {
      count: count,
      results: results,
    },
    { status: 200 }
  );
}
