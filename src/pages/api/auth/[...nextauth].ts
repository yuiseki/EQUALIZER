import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
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

export default NextAuth(authOptions);
