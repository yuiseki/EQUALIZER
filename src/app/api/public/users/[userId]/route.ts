import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { userId: string };
  }
) {
  const results = await prisma.user.findMany({
    where: {
      id: params.userId,
    },
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      name: true,
      image: true,
    },
  });

  return NextResponse.json({
    results,
  });
}
