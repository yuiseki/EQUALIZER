import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { commentId: string };
  }
) {
  const count = await prisma.vote.count();
  const results = await prisma.vote.findMany({
    where: {
      commentId: params.commentId,
    },
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
