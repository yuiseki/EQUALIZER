import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { conversationId: string };
  }
) {
  const count = await prisma.conversation.count();
  const results = await prisma.conversation.findMany({
    where: {
      id: params.conversationId,
    },
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
