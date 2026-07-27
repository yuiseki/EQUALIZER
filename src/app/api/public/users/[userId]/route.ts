import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  props: {
    params: Promise<{ userId: string }>;
  }
) {
  const prisma = await getPrisma();
  const params = await props.params;
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
