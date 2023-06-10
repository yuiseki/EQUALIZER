import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { conversationId: string };
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.warn("Not Authorized");
  }
  const count = await prisma.comment.count();
  const results = await prisma.comment.findMany({
    where: {
      conversationId: params.conversationId,
    },
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      conversationId: true,
      text: true,
      votes: true,
    },
  });

  const users: Array<{
    userId: string;
    votes: Array<{
      commentId: string;
      value: number | null;
    }>;
  }> = [];
  for (const comment of results) {
    for (const vote of comment.votes) {
      const filteredUsers = users.filter((u) => u.userId === vote.userId);
      if (filteredUsers.length === 0) {
        const user = {
          userId: vote.userId,
          votes: [
            {
              commentId: vote.commentId,
              value: vote.value,
            },
          ],
        };
        users.push(user);
      } else {
        filteredUsers[0].votes.push({
          commentId: vote.commentId,
          value: vote.value,
        });
      }
    }
  }
  for (const user of users) {
    const userVoteCommentIds = user.votes.map((v) => v.commentId);
    for (const comment of results) {
      if (!userVoteCommentIds.includes(comment.id)) {
        user.votes.push({
          commentId: comment.id,
          value: 0,
        });
      }
    }
  }

  const votes = results.map((r) => {
    return r.votes.map((v) => v.value);
  });
  for (const vote of votes) {
    if (vote.length !== users.length) {
      Array.from({ length: users.length - vote.length }, () => 0).map((v) => {
        vote.push(v);
      });
    }
  }

  return NextResponse.json(
    {
      count: count,
      results: results,
      users: users,
      votes: votes,
    },
    { status: 200 }
  );
}
