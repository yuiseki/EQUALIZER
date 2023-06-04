import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }
  const result = await prisma.vote.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json({
    result,
  });
}

export async function POST(request: Request, response: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const res = await request.json();
  const commentId = res.commentId;
  const value = res.value as number;

  const result = await prisma.vote.create({
    data: {
      userId: user.id,
      commentId: commentId,
      value: value,
    },
  });
  return NextResponse.json({
    result,
  });
}
