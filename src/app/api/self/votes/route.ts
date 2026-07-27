import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { buildAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = await getPrisma();
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }
  const results = await prisma.vote.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json({
    results,
  });
}

export async function POST(request: Request) {
  const prisma = await getPrisma();
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const reqJson = (await request.json()) as any;
  const commentId = reqJson.commentId;
  const value = reqJson.value as number;

  const exists = await prisma.vote.findFirst({
    where: {
      userId: user.id,
      commentId: commentId,
    },
  });

  let results;
  if (exists) {
    results = await prisma.vote.update({
      where: {
        id: exists.id,
      },
      data: {
        userId: user.id,
        commentId: commentId,
        value: value,
      },
    });
  } else {
    results = await prisma.vote.create({
      data: {
        userId: user.id,
        commentId: commentId,
        value: value,
      },
    });
  }

  return NextResponse.json({
    results,
  });
}
