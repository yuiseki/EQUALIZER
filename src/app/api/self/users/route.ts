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
  const results = await prisma.user.findMany({
    where: { id: session.user.id },
  });
  return NextResponse.json({
    results,
  });
}
