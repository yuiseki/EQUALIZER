import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { buildAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = await getPrisma();
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    console.warn("Not Authorized")
  }
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
