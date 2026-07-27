import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getPrisma } from "@/lib/prisma";

// The D1-backed Prisma client can only be constructed once a request's env
// bindings are available (see src/lib/prisma.ts), so authOptions can no
// longer be a module-level constant - it has to be built per-request, same
// as the underlying prisma client.
export const buildAuthOptions = async () => {
  const prisma = await getPrisma();
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_API_KEY as string,
        clientSecret: process.env.TWITTER_API_KEY_SECRET as string,
      }),
    ],
    callbacks: {
      session: async ({ session, user }: { session: any; user: any }) => {
        return {
          ...session,
          user: user,
        };
      },
    },
  };
};

export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authOptions = await buildAuthOptions();
  return NextAuth(req, res, authOptions);
}
