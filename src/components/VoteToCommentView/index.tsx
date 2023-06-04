/* eslint-disable @next/next/no-img-element */
import { DialogueElement } from "@/types/DialogueElement";
import { AvatarIcon } from "@/components/AvatarIcon";
import styles from "./styles.module.css";
import { useCallback, useState } from "react";

export const VoteToCommentView: React.FC<{
  comment: string;
  commentIndex: number;
  commentId: string;
  vote: any;
  onVote: (commentId: string, value: number) => void;
}> = ({ comment, commentIndex, commentId, vote, onVote }) => {
  console.log(vote);
  const [voted, setVoted] = useState(!!vote);
  const [votedValue, setVotedValue] = useState<number | undefined>(
    vote ? vote.value : undefined
  );
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
                }}
              >
                {row}
              </div>
            );
          })}
        </div>
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
              border: "none",
              borderRadius: "4px",
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
              border: "none",
              borderRadius: "4px",
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
              border: "none",
              borderRadius: "4px",
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
      </div>
    </div>
  );
};
