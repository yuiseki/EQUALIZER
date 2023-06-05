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
  isLoggedIn: boolean;
  isPreview?: boolean;
}> = ({
  comment,
  commentIndex,
  commentId,
  vote,
  voteResults,
  onVote,
  isLoggedIn,
  isPreview,
}) => {
  const [voted, setVoted] = useState(!!vote);
  const [votedValue, setVotedValue] = useState<number | undefined>(
    vote ? vote.value : undefined
  );
  const totalVoteCount = useMemo(() => {
    return voteResults.length;
  }, [voteResults]);
  const upVoteCount = useMemo(() => {
    return voteResults.filter((vote: any) => vote.value === -1).length;
  }, [voteResults]);
  const downVoteCount = useMemo(() => {
    return voteResults.filter((vote: any) => vote.value === 1).length;
  }, [voteResults]);
  const noVoteCount = useMemo(() => {
    return voteResults.filter((vote: any) => vote.value === 0).length;
  }, [voteResults]);
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
        {isLoggedIn && voted ? (
          <div
            className="voteToCommentTextRow"
            style={{
              minHeight: "1em",
              maxWidth: "100%",
              wordBreak: "break-all",
              marginBottom: "15px",
            }}
          >
            という意見についてのあなたの考えを教えていただき、ありがとうございました。
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
            という意見について、あなたの考えを教えてください。
          </div>
        )}
        <div
          style={{
            marginTop: "25px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
          }}
        >
          <button
            style={{
              padding: "4px",
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
              padding: "4px",
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
              padding: "4px",
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
        {(voted || isPreview) && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              marginTop: "15px",
              opacity: 0.8,
            }}
          >
            <div style={{ flexGrow: 1 }}>賛成：{upVoteCount}件</div>
            <div style={{ flexGrow: 1, textAlign: "center" }}>
              反対：{downVoteCount}件
            </div>
            <div style={{ flexGrow: 1, textAlign: "end" }}>
              わからない/どちらでもない：{noVoteCount}件
            </div>
          </div>
        )}
        {(voted || isPreview) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
              maxHeight: "10px",
              opacity: 0.8,
              borderRadius: "4px",
            }}
          >
            {Array.from({ length: upVoteCount }).map((item, idx) => {
              return (
                <div
                  key={`comment-${commentIndex}-upvote-${idx}`}
                  style={{
                    flexGrow: 1,
                    backgroundColor: "green",
                    borderRadius: "4px",
                    margin: "0 4px",
                  }}
                  title={`賛成：${upVoteCount}`}
                >
                  &nbsp;
                </div>
              );
            })}
            {Array.from({ length: downVoteCount }).map((item, idx) => {
              return (
                <div
                  key={`comment-${commentIndex}-upvote-${idx}`}
                  style={{
                    flexGrow: 1,
                    backgroundColor: "red",
                    borderRadius: "4px",
                    margin: "0 4px",
                    opacity: 0.6,
                  }}
                  title={`反対：${downVoteCount}`}
                >
                  &nbsp;
                </div>
              );
            })}
            {Array.from({ length: noVoteCount }).map((item, idx) => {
              return (
                <div
                  key={`comment-${commentIndex}-upvote-${idx}`}
                  style={{
                    flexGrow: 1,
                    backgroundColor: "gray",
                    borderRadius: "4px",
                    margin: "0 4px",
                  }}
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
