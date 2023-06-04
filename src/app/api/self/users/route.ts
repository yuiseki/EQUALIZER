import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(authOptions);
  const result = await prisma.user.findMany({
    where: { id: session.user.id },
  });
  return NextResponse.json({
    result,
  });
}
