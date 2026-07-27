import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  props: {
    params: Promise<{ commentId: string }>;
  }
) {
  const prisma = await getPrisma();
  const params = await props.params;
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
