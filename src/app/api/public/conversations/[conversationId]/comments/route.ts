import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { conversationId: string };
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.warn("Not Authorized");
  }
  const count = await prisma.comment.count();
  const results = await prisma.comment.findMany({
    where: {
      conversationId: params.conversationId,
    },
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      conversationId: true,
      text: true,
      votes: true,
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
