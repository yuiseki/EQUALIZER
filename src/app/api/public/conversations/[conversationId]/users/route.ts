import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = await getPrisma();
  const count = await prisma.user.count();

  return NextResponse.json({
    count: count,
  });
}
