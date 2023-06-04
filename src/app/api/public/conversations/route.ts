import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const count = await prisma.conversation.count();

  return NextResponse.json({
    count: count,
  });
}
