"use client";

import { DialogueElementView } from "@/components/DialogueElementView";
import { TextInput } from "@/components/TextInput";
import { DialogueElement } from "@/types/DialogueElement";
import { nextPostJson } from "@/utils/nextPostJson";
import { scrollToBottom } from "@/utils/scrollBottom";
import { sleep } from "@/utils/sleep";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./page.module.css";

const greetings = `Hello! I'm EQUALIZER, an Interactive deliberation facilitating and humanity inclusion support system.`;

export default function Home() {
  const [requesting, setRequesting] = useState(false);

  // input ref and state
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState("");

  // dialogue state
  const [dialogueList, setDialogueList] = useState<DialogueElement[]>([]);
  const [lazyInserting, setLazyInserting] = useState(false);
  const [insertingText, setInsertingText] = useState(greetings);
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

    setRequesting(true);
    const surfaceRes = await nextPostJson("/api/surface", {
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

    /*
    setResponding(true);
    setRequesting(true);
    const innerRes = await nextPostJson("/api/inner", {
      pastMessages: JSON.stringify(surfaceResJson.history),
    });
    const innerResJson = await innerRes.json();
    console.log(innerResJson);
    // TODO: process innerResJson
    // TODO: request to /api/deep
    setResponding(false);
    setRequesting(false);
    */
  }, [inputText, insertNewDialogue, pastMessages]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      insertNewDialogue(
        {
          who: "assistant",
          text: greetings,
        },
        false
      );
    } else {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [mounted, insertNewDialogue]);
  if (!mounted) return null;

  return (
    <main className={styles.main}>
      <h1>EQUALIZER</h1>
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
            />
          );
        })}
      </div>
      <div className={styles.textInputWrap}>
        <TextInput
          textareaRef={textareaRef}
          disabled={responding || lazyInserting}
          placeholder={"こんにちは。今日の議題はなんですか？"}
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={onSubmit}
        />
      </div>
    </main>
  );
}
