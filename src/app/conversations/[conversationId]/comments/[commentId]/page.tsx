"use client";
import { VoteToCommentView } from "@/components/VoteToCommentView";
import { jsonFetcher } from "@/utils/jsonFetcher";
import useSWR from "swr";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { TweetButton } from "@/components/TweetButton";

export default function Page({
  params: { conversationId, commentId },
}: {
  params: { conversationId: string; commentId: string };
}) {
  // initialize user
  const { data: userData, error: userDataError } = useSWR(
    "/api/auth/session",
    jsonFetcher
  );
  const [user, setUser] = useState<
    | {
        name: string;
        email: string;
        image: string;
      }
    | undefined
  >();
  useEffect(() => {
    if (userData && "user" in userData) {
      setUser(userData.user);
    }
  }, [userData]);

  const {
    data: publicComments,
    error: publicCommentError,
    mutate: mutatePublicComments,
  } = useSWR(
    `/api/public/conversations/${conversationId}/comments`,
    jsonFetcher
  );
  const {
    data: publicVotes,
    error: publicVotesError,
    mutate: mutatePublicVotes,
  } = useSWR(
    `/api/public/conversations/${conversationId}/comments/${commentId}/votes`,
    jsonFetcher
  );
  const {
    data: selfVotes,
    error: selfVotesError,
    mutate: mutateSelfVotes,
  } = useSWR("/api/self/votes", jsonFetcher);
  const [selfVote, setSelfVote] = useState();
  useEffect(() => {
    const filteredSelfVotes = selfVotes?.results?.filter(
      (vote: any) => vote.commentId === commentId
    );
    const newSelfVote =
      filteredSelfVotes?.length === 1 ? filteredSelfVotes[0] : undefined;
    setSelfVote(newSelfVote);
  }, [commentId, selfVotes?.results]);
  if (!publicComments || !publicVotes) {
    return null;
  }
  return (
    <main className={styles.main}>
      <VoteToCommentView
        comment={publicComments.results[0].text}
        commentIndex={1}
        commentId={commentId}
        vote={selfVote}
        voteResults={publicVotes.results}
        onVote={() => {}}
        isLoggedIn={!!user}
        isPreview={true}
      />
    </main>
  );
}
