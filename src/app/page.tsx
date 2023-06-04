"use client";

import { DialogueElementView } from "@/components/DialogueElementView";
import { TextInput } from "@/components/TextInput";
import { DialogueElement } from "@/types/DialogueElement";
import { nextPostJson } from "@/utils/nextPostJson";
import { scrollToBottom } from "@/utils/scrollBottom";
import { sleep } from "@/utils/sleep";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./page.module.css";
import useSWR from "swr";
import { jsonFetcher } from "@/utils/jsonFetcher";
import { VoteToCommentView } from "@/components/VoteToCommentView";

const themes = `
現在、以下の議題への参加をお待ちしています。

- ChatGPT のような AI アシスタントをユーザーの好みや好みに合わせてパーソナライズすることは、どこまで進むべきだと思いますか? このプロセスにはどのような境界線が存在すべきでしょうか?
- AI アシスタントは公人の視点に関する質問にどのように答えるべきでしょうか? たとえば、彼らは中立であるべきですか？彼らは答えることを拒否すべきでしょうか？何らかの情報源を提供すべきでしょうか？
- AI アシスタントが医療/財務/法律に関するアドバイスを提供できる場合、どのような条件下で許可されるべきですか?
- AI アシスタントが個人に精神的なサポートを提供する必要があるのは、どのような場合ですか?
- 画像から人々の性別、人種、感情、アイデンティティ/名前を特定するために、共同視覚言語モデルを許可すべきでしょうか? なぜ、あるいはなぜそうではないのでしょうか？
- 生成モデルが「CEO」、「医師」、「看護師」などの詳細が指定されていないプロンプトの画像を作成する場合、多様な出力または均一な出力が生成される可能性があります。AI モデルはこれらの可能性のバランスをどのようにとるべきでしょうか? このような場合、人物の描写はどのような要素を重視して決めればよいのでしょうか？
- 人権と、LGBTQ の権利や女性の権利など、地域の文化的または法的な違いの両方が関係するトピックを扱う場合、AI はどのような原則に従う必要がありますか? AI の応答は、AI が使用される場所や文化に基づいて変更する必要がありますか?
- AI モデルの作成者は、どのカテゴリーのコンテンツを制限または拒否することに重点を置くべきだと思いますか? これらの制限を決定するにはどのような基準を使用する必要がありますか?

どの議題に関心がありますか？
`;

const greetingsBefore = `ようこそ。私は対話型熟議促進人類包摂支援システム「イコライザー」です。
重要な議論に参加していただけませんか？あなたの協力が必要です。

現在の議題は「ChatGPTのようなAIアシスタントの、ユーザーの趣味嗜好に合わせたパーソナライゼーションは、どこまで進めるべきだとお考えですか？このプロセスに境界線があるとすれば、それはどのようなものでしょうか？」です。`;

const greetingsAfter =
  "ぜひ、あなたの考えを教えてください。ご協力をお願いします！";

export default function Home() {
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

  // initialize greetings
  const [greetings, setGreetings] = useState<string | undefined>();
  const { data: users, error: userError } = useSWR(
    "/api/public/users",
    jsonFetcher
  );
  const {
    data: comments,
    error: commentError,
    mutate: mutateComments,
  } = useSWR("/api/public/comments", jsonFetcher);
  const {
    data: votes,
    error: votesError,
    mutate: mutateVotes,
  } = useSWR("/api/self/votes", jsonFetcher);
  useEffect(() => {
    if (!users || !comments || !votes) {
      return;
    }
    const greetingsInfo = `
現在、この議題に対して ${users.count}名 のユーザーが議論に参加し、 ${comments.count}件 の意見が集まっています。
`;
    setGreetings(`${greetingsBefore}
${greetingsInfo}
${greetingsAfter}`);
  }, [comments, users, votes]);

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

    /*
    setRequesting(true);
    const innerRes = await nextPostJson("/api/ai/inner", {
      pastMessages: JSON.stringify(surfaceResJson.history),
    });
    const innerResJson = await innerRes.json();
    console.log(innerResJson);
    // TODO: process innerResJson
    // TODO: request to /api/ai/deep
    setResponding(false);
    setRequesting(false);
    */
  }, [inputText, insertNewDialogue, pastMessages]);

  // プロトタイプでは使わない
  /*
  const onSubmitNewConversation = useCallback(async () => {
    const res = await nextPostJson("/api/self/conversations", {
      topic: "AIアシスタントのパーソナライゼーションはどこまでやるべきか？",
      description:
        "ChatGPTのようなAIアシスタントの、ユーザーの趣味嗜好に合わせたパーソナライゼーションはどこまでやるべきだと思うか？",
    });
    const json = await res.json();
    console.log(json);
  }, []);
  */

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
    await mutateComments();
    setRequesting(false);
    await sleep(200);
    scrollToBottom();
  }, [inputText, mutateComments]);

  const onSubmitNewVote = useCallback(
    async (commentId: string, value: number) => {
      const res = await nextPostJson("/api/self/votes", {
        commentId: commentId,
        value: value,
      });
      const json = await res.json();
      console.log(json);
      mutateVotes();
    },
    [mutateVotes]
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
      <div
        className="dialogueListWrap"
        style={{
          width: "100%",
          margin: "0 auto 5em",
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
        {user &&
          comments &&
          votes &&
          comments.results.map((comment: any, commentIndex: number) => {
            const filteredVotes = votes?.results?.filter(
              (vote: any) => vote.commentId === comment.id
            );
            const vote =
              filteredVotes?.length === 1 ? filteredVotes[0] : undefined;
            return (
              <VoteToCommentView
                key={commentIndex}
                comment={comment.text}
                commentIndex={commentIndex}
                commentId={comment.id}
                vote={vote}
                onVote={onSubmitNewVote}
              />
            );
          })}
      </div>
      <div className={styles.textInputWrap}>
        <TextInput
          textareaRef={textareaRef}
          disabled={
            requesting ||
            responding ||
            lazyInserting ||
            !user ||
            !comments ||
            !votes ||
            comments.results.length !== votes.results.length
          }
          placeholder={
            !user ||
            !comments ||
            !votes ||
            comments.results.length !== votes.results.length
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
