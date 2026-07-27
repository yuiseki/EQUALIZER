import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  props: {
    params: Promise<{ conversationId: string }>;
  }
) {
  const prisma = await getPrisma();
  const params = await props.params;
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
