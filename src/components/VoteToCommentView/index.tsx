/* eslint-disable @next/next/no-img-element */
import { DialogueElement } from "@/types/DialogueElement";
import { AvatarIcon } from "@/components/AvatarIcon";
import styles from "./styles.module.css";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { TweetButton } from "../TweetButton";

export const VoteToCommentView: React.FC<{
  conversationId?: string;
  comment: string;
  commentIndex: number;
  commentId: string;
  vote: any;
  voteResults: any;
  onVote: (commentId: string, value: number) => void;
  isLoggedIn: boolean;
  isPreview?: boolean;
}> = ({
  conversationId,
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
    if (!voteResults) {
      return 0;
    }
    return voteResults.length;
  }, [voteResults]);
  const upVoteCount = useMemo(() => {
    if (!voteResults) {
      return 0;
    }
    return voteResults.filter((vote: any) => vote.value === -1).length;
  }, [voteResults]);
  const downVoteCount = useMemo(() => {
    if (!voteResults) {
      return 0;
    }
    return voteResults.filter((vote: any) => vote.value === 1).length;
  }, [voteResults]);
  const noVoteCount = useMemo(() => {
    if (!voteResults) {
      return 0;
    }
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
        {isLoggedIn && voted && (
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
        )}
        {isLoggedIn && !voted && (
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
        {
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
                  voted || !isLoggedIn
                    ? votedValue === -1
                      ? "4px solid #77ffff"
                      : "4px solid transparent"
                    : "4px solid transparent"
                }`,
                backgroundColor: `${
                  voted || !isLoggedIn
                    ? votedValue === -1
                      ? "rgba(239, 239, 239, 0.9)"
                      : "rgba(239, 239, 239, 0.5)"
                    : "rgba(239, 239, 239, 1)"
                }`,
                color: `${
                  voted || !isLoggedIn
                    ? votedValue === -1
                      ? "rgba(16, 16, 16, 0.9)"
                      : "rgba(16, 16, 16, 0.5)"
                    : "rgba(16, 16, 16, 1)"
                }`,
                opacity: `${voted ? (votedValue === -1 ? 0.8 : 0.5) : 1}`,
              }}
              onClick={onClickUpVote}
              disabled={voted || !isLoggedIn}
            >
              ✅ 賛成
            </button>
            <button
              style={{
                padding: "4px",
                borderRadius: "4px",
                border: `${
                  voted || !isLoggedIn
                    ? votedValue === 1
                      ? "4px solid #77ffff"
                      : "4px solid transparent"
                    : "4px solid transparent"
                }`,
                backgroundColor: `${
                  voted || !isLoggedIn
                    ? votedValue === 1
                      ? "rgba(239, 239, 239, 0.9)"
                      : "rgba(239, 239, 239, 0.5)"
                    : "rgba(239, 239, 239, 1)"
                }`,
                color: `${
                  voted || !isLoggedIn
                    ? votedValue === 1
                      ? "rgba(16, 16, 16, 0.9)"
                      : "rgba(16, 16, 16, 0.5)"
                    : "rgba(16, 16, 16, 1)"
                }`,
                opacity: `${voted ? (votedValue === 1 ? 0.8 : 0.5) : 1}`,
              }}
              onClick={onClickDownVote}
              disabled={voted || !isLoggedIn}
            >
              🚫 反対
            </button>
            <button
              style={{
                padding: "4px",
                borderRadius: "4px",
                border: `${
                  voted || !isLoggedIn
                    ? votedValue === 0
                      ? "4px solid #77ffff"
                      : "4px solid transparent"
                    : "4px solid transparent"
                }`,
                backgroundColor: `${
                  voted || !isLoggedIn
                    ? votedValue === 0
                      ? "rgba(239, 239, 239, 0.9)"
                      : "rgba(239, 239, 239, 0.5)"
                    : "rgba(239, 239, 239, 1)"
                }`,
                color: `${
                  voted || !isLoggedIn
                    ? votedValue === 0
                      ? "rgba(16, 16, 16, 0.9)"
                      : "rgba(16, 16, 16, 0.5)"
                    : "rgba(16, 16, 16, 1)"
                }`,
                opacity: `${voted ? (votedValue === 0 ? 0.8 : 0.5) : 1}`,
              }}
              onClick={onClickNoVote}
              disabled={voted || !isLoggedIn}
            >
              🤔 わからない/どちらでもない
            </button>
          </div>
        }
        {!isLoggedIn && (
          <div
            style={{
              marginTop: "1em",
              fontSize: "1.4rem",
            }}
          >
            <Link href="/api/auth/signin">
              <span
                style={{
                  textDecoration: "underline",
                }}
              >
                この意見に対する考えを表明するために、Twitterアカウントでログインする
              </span>
            </Link>
          </div>
        )}
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
        {conversationId && (
          <div
            style={{
              marginTop: "15px",
            }}
          >
            <Link
              href={`/conversations/${conversationId}/comments/${commentId}`}
            >
              <span
                style={{
                  textDecoration: "underline",
                }}
              >
                permalink
              </span>
            </Link>
          </div>
        )}
        {isPreview && voted && (
          <div
            style={{
              width: "120px",
              margin: "25px auto 0",
            }}
          >
            <TweetButton
              text={`「${comment}」に、「${
                vote.value === -1
                  ? "賛成"
                  : vote.value === 1
                  ? "反対"
                  : "わからない/どちらでもない"
              }」と投票しました`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
