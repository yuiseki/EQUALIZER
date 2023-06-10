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
import { ConversationView } from "@/components/ConversationView";

const greetingsBefore = `ようこそ。私は対話型熟議促進人類包摂支援システム「イコライザー」です。
重要な議論に参加していただけませんか？あなたの協力が必要です。

現在、以下の議題が展開されています。`;

const greetingsAfter =
  "ぜひ、あなたの考えを教えてください。ご協力をお願いします。";

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

  // api data

  const {
    data: publicConversations,
    error: publicConversationsError,
    mutate: mutatePublicConversations,
  } = useSWR("/api/public/conversations", jsonFetcher);

  // initialize greetings
  const [greetings, setGreetings] = useState<string | undefined>();
  useEffect(() => {
    setGreetings(`${greetingsBefore}
${greetingsAfter}`);
  }, []);

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

  const onSubmitNewConversation = useCallback(async () => {
    const newInputText = inputText.trim();
    setInputText("");
    console.log(newInputText);
    setRequesting(true);
    const res = await nextPostJson("/api/self/conversations", {
      topic: newInputText.split("\n")[0],
      description: newInputText.split("\n")[1],
    });
    const json = await res.json();
    console.log(json);
    await sleep(500);
    await mutatePublicConversations();
    setRequesting(false);
    await sleep(200);
    scrollToBottom();
  }, [inputText, mutatePublicConversations]);

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
          margin: "0 auto 6em",
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
        {publicConversations &&
          publicConversations.results.map((conversation: any) => {
            return (
              <ConversationView
                key={conversation.id}
                conversationId={conversation.id}
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
            user.email !== "yuiseki+ad@gmail.com"
          }
          placeholder={
            !user
              ? "モデレーターになると、議題を追加できます"
              : "新たな議題を追加する"
          }
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={onSubmitNewConversation}
        />
      </div>
    </main>
  );
}
