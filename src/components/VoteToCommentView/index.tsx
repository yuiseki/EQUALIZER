/* eslint-disable @next/next/no-img-element */
import { DialogueElement } from "@/types/DialogueElement";
import { AvatarIcon } from "@/components/AvatarIcon";
import styles from "./styles.module.css";
import { useCallback, useMemo, useState } from "react";

export const VoteToCommentView: React.FC<{
  comment: string;
  commentIndex: number;
  commentId: string;
  vote: any;
  voteResults: any;
  onVote: (commentId: string, value: number) => void;
}> = ({ comment, commentIndex, commentId, vote, voteResults, onVote }) => {
  const [voted, setVoted] = useState(!!vote);
  const [votedValue, setVotedValue] = useState<number | undefined>(
    vote ? vote.value : undefined
  );
  const totalVoteCount = useMemo(() => {
    return voteResults.length;
  }, []);
  const upVoteCount = useMemo(() => {
    return voteResults.filter((vote: any) => vote.value === -1).length;
  }, []);
  const downVoteCount = useMemo(() => {
    return voteResults.filter((vote: any) => vote.value === 1).length;
  }, []);
  const noVoteCount = useMemo(() => {
    return voteResults.filter((vote: any) => vote.value === 0).length;
  }, []);
  const onClickUpVote = useCallback(() => {
    setVoted(true);
    setVotedValue(-1);
    onVote(commentId, -1);
  }, [commentId, onVote]);
  const onClickDownVote = useCallback(() => {
    setVoted(true);
    setVotedValue(1);
    onVote(commentId, 1);
  }, [commentId, onVote]);
  const onClickNoVote = useCallback(() => {
    setVoted(true);
    setVotedValue(0);
    onVote(commentId, 0);
  }, [commentId, onVote]);
  return (
    <div
      className={`${styles.voteToCommentView} ${styles.voteToCommentViewAssistant}`}
      style={{ opacity: `${voted ? 0.9 : 1}` }}
    >
      <div className="avatarIconWrap">
        <AvatarIcon who={"assistant"} />
      </div>
      <div
        className="voteToCommentWrap"
        style={{
          flexGrow: 1,
        }}
      >
        <div
          className="voteToCommentTextWrap"
          style={{
            paddingLeft: "5px",
            paddingRight: "5px",
            flexGrow: 1,
            maxWidth: "100%",
          }}
        >
          {comment.split("\n").map((row, rowIdx) => {
            return (
              <div
                className="voteToCommentTextRow"
                key={`comment-${commentIndex}-${rowIdx}`}
                style={{
                  minHeight: "1em",
                  maxWidth: "100%",
                  wordBreak: "break-all",
                  fontSize: "1.3rem",
                }}
              >
                「{row}」
              </div>
            );
          })}
        </div>
        {voted ? (
          <div
            className="voteToCommentTextRow"
            style={{
              minHeight: "1em",
              maxWidth: "100%",
              wordBreak: "break-all",
              marginBottom: "15px",
            }}
          >
            という意見についての考えを教えていただき、ありがとうございました。
          </div>
        ) : (
          <div
            className="voteToCommentTextRow"
            style={{
              minHeight: "1em",
              maxWidth: "100%",
              wordBreak: "break-all",
              marginBottom: "15px",
            }}
          >
            という意見があります。あなたの考えを教えてください。
          </div>
        )}
        <div
          style={{
            marginTop: "25px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: `${
                voted
                  ? votedValue === -1
                    ? "4px solid #77ffff"
                    : "4px solid transparent"
                  : "4px solid transparent"
              }`,
              backgroundColor: `${
                voted
                  ? votedValue === -1
                    ? "rgba(239, 239, 239, 0.9)"
                    : "rgba(239, 239, 239, 0.5)"
                  : "rgba(239, 239, 239, 1)"
              }`,
              color: `${
                voted
                  ? votedValue === -1
                    ? "rgba(16, 16, 16, 0.9)"
                    : "rgba(16, 16, 16, 0.5)"
                  : "rgba(16, 16, 16, 1)"
              }`,
              opacity: `${voted ? (votedValue === -1 ? 0.8 : 0.5) : 1}`,
            }}
            onClick={onClickUpVote}
            disabled={voted}
          >
            ✅ 賛成
          </button>
          <button
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: `${
                voted
                  ? votedValue === 1
                    ? "4px solid #77ffff"
                    : "4px solid transparent"
                  : "4px solid transparent"
              }`,
              backgroundColor: `${
                voted
                  ? votedValue === 1
                    ? "rgba(239, 239, 239, 0.9)"
                    : "rgba(239, 239, 239, 0.5)"
                  : "rgba(239, 239, 239, 1)"
              }`,
              color: `${
                voted
                  ? votedValue === 1
                    ? "rgba(16, 16, 16, 0.9)"
                    : "rgba(16, 16, 16, 0.5)"
                  : "rgba(16, 16, 16, 1)"
              }`,
              opacity: `${voted ? (votedValue === 1 ? 0.8 : 0.5) : 1}`,
            }}
            onClick={onClickDownVote}
            disabled={voted}
          >
            🚫 反対
          </button>
          <button
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: `${
                voted
                  ? votedValue === 0
                    ? "4px solid #77ffff"
                    : "4px solid transparent"
                  : "4px solid transparent"
              }`,
              backgroundColor: `${
                voted
                  ? votedValue === 0
                    ? "rgba(239, 239, 239, 0.9)"
                    : "rgba(239, 239, 239, 0.5)"
                  : "rgba(239, 239, 239, 1)"
              }`,
              color: `${
                voted
                  ? votedValue === 0
                    ? "rgba(16, 16, 16, 0.9)"
                    : "rgba(16, 16, 16, 0.5)"
                  : "rgba(16, 16, 16, 1)"
              }`,
              opacity: `${voted ? (votedValue === 0 ? 0.8 : 0.5) : 1}`,
            }}
            onClick={onClickNoVote}
            disabled={voted}
          >
            🤔 わからない/どちらでもない
          </button>
        </div>
        {voted && (
          <div
            style={{
              display: "flex",
              flexGrow: "space-between",
              marginTop: "15px",
              maxHeight: "10px",
              opacity: 0.8,
            }}
          >
            {Array.from({ length: upVoteCount }).map(() => {
              return (
                <div
                  style={{ flexGrow: 1, backgroundColor: "green" }}
                  title={`賛成：${upVoteCount}`}
                >
                  &nbsp;
                </div>
              );
            })}
            {Array.from({ length: downVoteCount }).map(() => {
              return (
                <div
                  style={{ flexGrow: 1, backgroundColor: "red", opacity: 0.6 }}
                  title={`反対：${downVoteCount}}`}
                >
                  &nbsp;
                </div>
              );
            })}
            {Array.from({ length: noVoteCount }).map(() => {
              return (
                <div
                  style={{ flexGrow: 1, backgroundColor: "gray" }}
                  title={`わからない/どちらでもない：${noVoteCount}`}
                >
                  &nbsp;
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
