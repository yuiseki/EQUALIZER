import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(authOptions);
  const result = await prisma.vote.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json({
    result,
  });
}

export async function POST(request: Request, response: Response) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const res = await request.json();
  const commentId = res.commentId;
  const vote = res.vote;

  const result = await prisma.vote.create({
    data: {
      userId: user.id,
      commentId: commentId,
      vote: vote,
    },
  });
  return NextResponse.json({
    result,
  });
}
