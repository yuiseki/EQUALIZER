"use client";
import { DialogueElement } from "@/types/DialogueElement";
import { jsonFetcher } from "@/utils/jsonFetcher";
import { nextPostJson } from "@/utils/nextPostJson";
import { scrollToBottom } from "@/utils/scrollBottom";
import { sleep } from "@/utils/sleep";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import styles from "./styles.module.css";
import { DialogueElementView } from "@/components/DialogueElementView";
import { VoteToCommentView } from "@/components/VoteToCommentView";
import { TextInput } from "@/components/TextInput";
import { ConversationVisualizationView } from "@/components/ConversationVisualizationView";
import { ConversationView } from "@/components/ConversationView";
import Link from "next/link";

const greetingsBefore = `ようこそ。私は対話型熟議促進人類包摂支援システム「イコライザー」です。
重要な議論に参加していただけませんか？あなたの協力が必要です。

現在の議題は「ChatGPTのようなAIアシスタントの、ユーザーの趣味嗜好に合わせたパーソナライゼーションは、どこまで進めるべきだとお考えですか？このプロセスに境界線があるとすれば、それはどのようなものでしょうか？」です。`;

const greetingsAfter =
  "ぜひ、あなたの考えを教えてください。ご協力をお願いします！";

export default function Page({
  params: { conversationId },
}: {
  params: { conversationId: string };
}) {
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

  const [requesting, setRequesting] = useState(false);

  // input ref and state
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState("");

  const {
    data: publicComments,
    error: publicCommentError,
    mutate: mutatePublicComments,
  } = useSWR<{
    count: number;
    results: Array<{
      id: string;
      conversationId: string;
      text: string;
      votes: Array<{
        id: string;
        userId: string;
        commentId: string;
        value: number;
      }>;
    }>;
    users: Array<{
      userId: string;
      votes: Array<{
        commentId: string;
        value: number;
      }>;
    }>;
    votes: Array<Array<number>>;
  }>(`/api/public/conversations/${conversationId}/comments`, jsonFetcher);

  // TODO: conversationIdで絞り込む
  const {
    data: selfVotes,
    error: selfVotesError,
    mutate: mutateSelfVotes,
  } = useSWR("/api/self/votes", jsonFetcher);

  // initialize greetings
  const [greetings, setGreetings] = useState<string | undefined>();
  useEffect(() => {
    if (!publicComments || !selfVotes) {
      return;
    }
    const greetingsInfo = `
現在、この議題に対して ${publicComments.users.length}名 のユーザーが議論に参加し、 ${publicComments.results.length}件 の意見が集まっています。
`;
    setGreetings(`${greetingsBefore}
${greetingsInfo}
${greetingsAfter}`);
  }, [publicComments, selfVotes]);

  // dialogue state
  const [dialogueList, setDialogueList] = useState<DialogueElement[]>([]);
  const [lazyInserting, setLazyInserting] = useState(false);
  const [insertingText, setInsertingText] = useState("");
  const insertNewDialogue = useCallback(
    (newDialogueElement: DialogueElement, lazy?: boolean) => {
      if (!lazy) {
        setDialogueList((prev) => {
          return [...prev, newDialogueElement];
        });
      } else {
        setLazyInserting(true);
        const lazyNewDialogueElement = {
          ...newDialogueElement,
          text: "",
        };
        setDialogueList((prev) => {
          return [...prev, lazyNewDialogueElement];
        });
        setInsertingText(newDialogueElement.text);
      }
    },
    []
  );
  const [lazyInsertingInitialized, setLazyInsertingInitialized] =
    useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  useEffect(() => {
    if (lazyInserting) {
      if (!lazyInsertingInitialized) {
        const newIntervalId = setInterval(() => {
          setDialogueList((prev) => {
            const last = prev[prev.length - 1];
            last.text = insertingText.slice(0, last.text.length + 1);
            scrollToBottom();
            if (insertingText.length === last.text.length) {
              setLazyInserting(false);
              setLazyInsertingInitialized(false);
              setInsertingText("");
              if (!requesting) {
                setResponding(false);
              }
            }
            return [...prev.slice(0, prev.length - 1), last];
          });
        }, 50);
        setIntervalId(newIntervalId);
        setLazyInsertingInitialized(true);
      }
    } else {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
    return () => {
      if (!lazyInserting) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
  }, [
    intervalId,
    lazyInserting,
    lazyInsertingInitialized,
    insertingText,
    requesting,
  ]);

  // communication state
  const [responding, setResponding] = useState(false);
  const [pastMessages, setPastMessages] = useState<
    { messages: Array<any> } | undefined
  >();
  const onSubmit = useCallback(async () => {
    setResponding(true);

    const newInputText = inputText.trim();
    setInputText("");
    console.log(newInputText);
    insertNewDialogue({
      who: "user",
      text: newInputText,
    });
    await sleep(200);
    scrollToBottom();

    setResponding(true);
    setRequesting(true);
    const surfaceRes = await nextPostJson("/api/ai/surface", {
      query: newInputText,
      pastMessages: pastMessages ? JSON.stringify(pastMessages) : undefined,
    });

    const surfaceResJson: {
      surface: string;
      history: { messages: Array<any> };
    } = await surfaceRes.json();
    setPastMessages(surfaceResJson.history);
    insertNewDialogue(
      {
        who: "assistant",
        text: surfaceResJson.surface,
      },
      true
    );
    setResponding(false);
  }, [inputText, insertNewDialogue, pastMessages]);

  const onSubmitNewComment = useCallback(async () => {
    const newInputText = inputText.trim();
    setInputText("");
    console.log(newInputText);
    setRequesting(true);
    const res = await nextPostJson("/api/self/comments", {
      conversationId: "647c072b4ab980bc5113d52e",
      text: newInputText,
    });
    const json = await res.json();
    console.log(json);
    await sleep(500);
    await mutatePublicComments();
    setRequesting(false);
    await sleep(200);
    scrollToBottom();
  }, [inputText, mutatePublicComments]);

  const onSubmitNewVote = useCallback(
    async (commentId: string, value: number) => {
      const res = await nextPostJson("/api/self/votes", {
        commentId: commentId,
        value: value,
      });
      const json = await res.json();
      console.log(json);
      mutateSelfVotes();
    },
    [mutateSelfVotes]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted && greetings) {
      setMounted(true);
      insertNewDialogue(
        {
          who: "assistant",
          text: greetings,
        },
        false
      );
      setPastMessages({
        messages: [
          {
            type: "ai",
            data: {
              content: greetings,
            },
          },
        ],
      });
    }
  }, [mounted, insertNewDialogue, greetings]);
  if (!mounted) return null;

  return (
    <main className={styles.main}>
      <Link href={`/`}>
        <h1
          style={{
            textDecoration: "underline",
          }}
        >
          イコライザー
        </h1>
      </Link>
      <ConversationView conversationId={conversationId} />
      <div
        className="dialogueListWrap"
        style={{
          width: "100%",
          margin: "0 auto 10em",
        }}
      >
        {dialogueList.map((dialogueElement, dialogueIndex) => {
          return (
            <DialogueElementView
              key={dialogueIndex}
              dialogueElement={dialogueElement}
              dialogueIndex={dialogueIndex}
              isResponding={
                (responding || lazyInserting) &&
                dialogueIndex === dialogueList.length - 1
              }
              needLogin={!user}
            />
          );
        })}
        {publicComments &&
          selfVotes &&
          0 < publicComments.results.length &&
          publicComments.results.map((comment: any, commentIndex: number) => {
            const filteredSelfVotes = selfVotes?.results?.filter(
              (vote: any) => vote.commentId === comment.id
            );
            const selfVote =
              filteredSelfVotes?.length === 1
                ? filteredSelfVotes[0]
                : undefined;
            return (
              <VoteToCommentView
                key={commentIndex}
                conversationId={conversationId}
                comment={comment.text}
                commentIndex={commentIndex}
                commentId={comment.id}
                vote={selfVote}
                voteResults={publicComments.results[0].votes}
                onVote={onSubmitNewVote}
                isLoggedIn={!!user}
              />
            );
          })}
      </div>
      {publicComments && selfVotes && 0 < publicComments.results.length && (
        <div className={styles.visualizationWrap}>
          <ConversationVisualizationView conversationId={conversationId} />
        </div>
      )}
      <div className={styles.textInputWrap}>
        <TextInput
          textareaRef={textareaRef}
          disabled={
            requesting ||
            responding ||
            lazyInserting ||
            !user ||
            !publicComments ||
            !selfVotes ||
            publicComments.results.length !== selfVotes.results.length
          }
          placeholder={
            !user ||
            !publicComments ||
            !selfVotes ||
            publicComments.results.length !== selfVotes.results.length
              ? "すべての意見の考えを教えていただけると、あなたの意見を追加できます"
              : "あなたの意見を追加する"
          }
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={onSubmitNewComment}
        />
      </div>
    </main>
  );
}
