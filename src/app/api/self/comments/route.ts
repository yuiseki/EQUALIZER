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
  const results = await prisma.comment.findMany({
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
  const conversationId = reqJson.conversationId;
  const text = reqJson.text;

  const results = await prisma.comment.create({
    data: {
      userId: user.id,
      conversationId: conversationId,
      text: text,
    },
  });
  return NextResponse.json({
    results,
  });
}
