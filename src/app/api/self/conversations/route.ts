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
  const results = await prisma.conversation.findMany({
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
  const topic = reqJson.topic;
  const description = reqJson.description;

  const results = await prisma.conversation.create({
    data: {
      userId: user.id,
      topic: topic,
      description: description,
    },
  });
  return NextResponse.json({
    results,
  });
}
