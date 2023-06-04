import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(authOptions);
  const result = await prisma.conversation.findMany({
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

  const res = await request.json();
  const topic = res.topic;
  const description = res.description;

  const result = await prisma.conversation.create({
    data: {
      userId: user.id,
      topic: topic,
      description: description,
    },
  });
  return NextResponse.json({
    result,
  });
}
